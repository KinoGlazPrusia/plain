import PlainStyle from '../PlainStyle/PlainStyle.js'

export default class PlainComponent extends HTMLElement {
    constructor(compName, stylePath) {
        super()

        this.name = compName
        this.parentComponent = null; // The parent component is required because the parent is outside the shadow always, so it's not accesible with parentNode (review it)
        this.shadow = this.#setShadowDOM()
        this.styles = this.#setStyle(stylePath) // The path should be relative to the entry point of the app
        this.wrapper = this.#setWrapper()
        this.signals = null

        this.shadow.appendChild(this.styles)
        this.shadow.appendChild(this.wrapper)
    }

    connectedCallback() { // Revisar si este método puede ser privado o no
        this.render() // Renderizado inicial al conectar el elemento
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

    $(selector) { // Función al estilo jQuery para retornar los elementos que componen el componente
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

    render() {
        this.wrapper.innerHTML = this.template() // Añadir un método de excepción para elementos que no deban ser re-renderizados
        this.#adoption()
        this.listeners()
        this.connectors()
    }

    #checkModifiedElements(previousDOM, nextDOM) {
        // Se checkea un nivel (wrapper) para ver si hay elementos que han cambiado (se han de chequear en paralelo el DOM anterior y el actual)
        // Si hay algún elemento que se ha cambiado, se checkea de manera recursiva hasta que no se encuentre ningún elemento que haya cambiado
            // Por cada elemento que haya cambiado, se hace un getModifiedElements para recuperar los elementos y su posición relativa dentro del nivel (wrapper)
            // Se sustituyen los elementos modificados por los nuevos con el método #replaceModifiedElements
    }

    #getModifiedElements(previousHTML, nextHTML) {
        // Example:
        const modifiedElements = [
            {html: '', position: 2}
        ]
    }

    #replaceModifiedElements(modifiedElements) {
        // Sustituimos en el wrapper los elementos modificados a través del index recuperado
        // Manteniendo todos los elementos que no hayan cambiado intactos
    }

    template() {} // Devuelve el HTML con la estructura de la página

    listeners() {} // Asigna listeners a los elementos interactivos

    connectors() {} // Asigna conexiones entre los componentes hijo

    #adoption() { 
        // Sometimes when children components are added to the DOM, they have no access to its parent until it have finished rendering the 
        // template and after that executed the adoption method. This issue have to be addressed in the future.
        this.wrapper.querySelectorAll('*').forEach(children => {
            children.parentComponent = this
        })
    }
}