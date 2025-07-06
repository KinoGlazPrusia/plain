import PlainStyle from '../PlainStyle/PlainStyle.js'

export default class PlainComponent extends HTMLElement {
    constructor(componentName, stylePath) {
        super()

        this.name = componentName
        this.parentComponent = null // The parent component is required because the parent is outside the shadow always, so it's not accesible with parentNode
        this.shadow = this.#setShadowDOM()
        this.styles = this.#setStyle(stylePath) // The path should be relative to the entry point of the app
        this.wrapper = this.#setWrapper()
        this.signals = null

        this.shadow.appendChild(this.styles)
        this.shadow.appendChild(this.wrapper)
    }

    connectedCallback() {
        this.render()
        this.elementConnected()
    }

    disconnectedCallback() {
        this.elementDisconnected()
    }

    #setShadowDOM() {
        const shadow = this.attachShadow({mode: 'open'})
        return shadow
    }

    #setWrapper() {
        const wrapper = document.createElement('div')
        wrapper.classList.add(`${this.name}-wrapper`)
        wrapper.setAttribute('plan', 'wrapper')
        return wrapper
    }

    #setStyle(path = null) {
        if (!path) {
            console.warn(
                `You haven't defined any style path for the component ${this.name}. 
                This component won't have any styles embedded in the shadow DOM. 
                If you want to use encapsulated styles, please define a path to the stylesheet in the constructor`
            )
        }

        const style = new PlainStyle()
        style.registerCSS(this.name, path)
        return style.renderCSS(this.name)
    }

    $(selector) {
        const element = this.wrapper.querySelector(selector) 
        
        if (element) {
            return element
        } else {
            return null
        }
    }

    $$(selector) {
        const collection = this.wrapper.querySelectorAll(selector) 
        
        if (collection) {
            return collection
        } else {
            return null
        }
    }

    html(strings, ...values) {
        return strings.reduce((result, str, i) => result + str + (values[i] || ''), '')
    }

    // TODO: Solve bug with incremental rendering (detected with page changes orchestrated by the router)
    render(
        forceFullRender = true, 
        logRenderChanges = false,
        logRenderTime = false
    ) {
        const startTime = performance.now()
        
        this.beforeRender()

        if (forceFullRender) {
            console.warn(`
                Rendering ${this.name} with full render (this is recommended for simple components with few children and no mixed states). 
                For complex components with many children and mixed states, use the incremental render method with the forceFullRender parameter set to false.
            `)
            this.wrapper.innerHTML = this.template()
        } else {
            console.warn(`
                Rendering ${this.name} with incremental changes (this is recommended for complex components with many children and mixed states). 
                For better performance, use the full render method with the forceFullRender parameter set to true.
            `)
            const changes = this.#compareDOM(
                this.wrapper.innerHTML, 
                this.template()
            )

            if (logRenderChanges) {
                console.log("CHANGES", changes)
            }

            this.#replaceDOM(changes)
        }

        this.#adoption()
        this.listeners()
        this.connectors()
        this.afterRender()

        if (logRenderTime) {
            const endTime = performance.now()
            const duration = (endTime - startTime).toFixed(2)
            console.log(`PlainComponent render (${this.name}): ${duration}ms`)
        }
    }

    #replaceDOM(changes) {
        Object.entries(changes).forEach(([path, change]) => {
            if (path === '') {
                this.wrapper.innerHTML = change.element.outerHTML || change.element.textContent || ''
                return
            }

            const indexes = path === '' 
                ? [] 
                : path.split('.').map(idx => Number(idx))

            const parentPath = indexes.slice(0, -1)
            const targetIndex = indexes[indexes.length - 1]

            const parentNode = this.#getNodeByPath(this.wrapper, parentPath)

            if (!parentNode) {
                console.warn(`PlainComponent: unable to resolve parent path ",${parentPath.join('.')}", skipping change`)
                return
            }

            switch (change.type) {
                case 'added': {
                    const referenceNode = parentNode.childNodes[targetIndex] || null
                    parentNode.insertBefore(change.element.cloneNode(true), referenceNode)
                    break
                }
                case 'removed': {
                    const nodeToRemove = parentNode.childNodes[targetIndex]
                    nodeToRemove && parentNode.removeChild(nodeToRemove)
                    break
                }
                case 'type_changed':
                case 'attributes_changed': {
                    const nodeToReplace = parentNode.childNodes[targetIndex]
                    if (nodeToReplace) {
                        parentNode.replaceChild(change.element.cloneNode(true), nodeToReplace)
                    }
                    break
                }
                case 'text_changed': {
                    const textNode = parentNode.childNodes[targetIndex]
                    if (textNode) {
                        textNode.textContent = change.element.textContent
                    }
                    break
                }
                default:
                    console.warn(`PlainComponent: unknown change type ${change.type}`)
            }
        })
    }

    #getNodeByPath(base, indexes) {
        let node = base
        for (const idx of indexes) {
            if (!node || !node.childNodes || idx >= node.childNodes.length) {
                return null
            }
            node = node.childNodes[idx]
        }
        return node
    }

    #compareDOM(previousDOM, nextDOM) {
        const parser = new DOMParser()
        
        const prev = parser.parseFromString(previousDOM, 'text/html')
        const next = parser.parseFromString(nextDOM, 'text/html')

        const changes = {}

        const queue = [{
            prev: prev.body,
            next: next.body,
            path: []
        }]

        while (queue.length) {
            const {prev, next, path} = queue.shift()

            if (!prev && next) {
                changes[path.join('.')] = {
                    type: 'added',
                    element: next.cloneNode(true)
                }
                continue
            }

            if (prev && !next) {
                changes[path.join('.')] = {
                    type: 'removed',
                    element: prev.cloneNode(true)
                }
                continue
            }

           if (prev.nodeType !== next.nodeType) {
                changes[path.join('.')] = {
                    type: 'type_changed',
                    element: next.cloneNode(true)
                }
                continue
            }

            if (
                prev.nodeType === Node.TEXT_NODE && 
                prev.textContent.trim() !== next.textContent.trim()
            ) {
                changes[path.join('.')] = {
                    type: 'text_changed',
                    element: next.cloneNode(true)
                }
                continue
            }

            if (
                prev.nodeType === Node.ELEMENT_NODE && 
                next.nodeType === Node.ELEMENT_NODE
            ) {
                if (prev.attributes.length !== next.attributes.length) {
                    changes[path.join('.')] = {
                        type: 'attributes_changed',
                        element: next.cloneNode(true)
                    }
                    continue
                }
            }

            const prevChildren = Array.from(prev.childNodes)
            const nextChildren = Array.from(next.childNodes)
            const maxLength = Math.max(prevChildren.length, nextChildren.length)

            for (let i = 0; i < maxLength; i++) {
                queue.push({
                    prev: prevChildren[i] || null,
                    next: nextChildren[i] || null,
                    path: [...path, i]
                })
            }
        }

        return changes
    }

    template() {} // Devuelve el HTML con la estructura de la página

    listeners() {} // Asigna listeners a los elementos interactivos

    connectors() {} // Asigna conexiones entre los componentes hijo

    elementConnected() {} // Método que se ejecuta cuando un elemento del componente se conecta al DOM

    elementDisconnected() {} // Método que se ejecuta cuando un elemento del componente se desconecta del DOM

    beforeRender() {} // Método que se ejecuta antes de renderizar el componente

    afterRender() {} // Método que se ejecuta después de renderizar el componente

    #adoption() { 
        // Sometimes when children components are added to the DOM, they have no access to its parent until it have finished rendering the 
        // template and after that executed the adoption method. This issue have to be addressed in the future.
        this.wrapper.querySelectorAll('*').forEach(children => {
            children.parentComponent = this
        })
    }
}