export default class PlainComponent extends HTMLElement {
    constructor(compName, stylePath) {
        super()

        this.name = compName
        this.parentComponent = null;
        this.shadow = this.#setShadowDOM()
        this.styles = this.#setStyle(stylePath)
        this.wrapper = this.#setWrapper()
        this.signals = null

        this.shadow.appendChild(this.styles)
        this.shadow.appendChild(this.wrapper)
    }

    connectedCallback() {
        this.render() // Renderizado inicial al conectar el elemento
    }

    #setShadowDOM() {
        const shadow = this.attachShadow({mode: 'open'})
        return shadow
    }

    #setWrapper() {
        const wrapper = document.createElement('div')
        wrapper.classList.add(`${this.name}-wrapper`)
        return wrapper
    }

    #setStyle(path) {
        const style = document.createElement('style')

        const xhr = new XMLHttpRequest()
        xhr.open('GET', path, false) // Intentar automatizar la captura del path del estilo
        xhr.send()

        style.textContent = xhr.responseText
        return style
    }

    $(selector) { // Función al estilo jQuery para retornar los elementos que componen el componente
        const element = this.wrapper.querySelector(selector) 
        
        if (element) {
            return element
        } else {
            throw new Error(`Theres no such element as '${selector}' in this component`)
        }
    }

    render() {
        this.wrapper.innerHTML = this.template()
        this.adoption()
        this.listeners()
    }

    template() {} // Devuelve el HTML con la estructura de la página

    listeners() {} // Asigna listeners a los elementos interactivos

    adoption() {
        this.wrapper.querySelectorAll('*').forEach(children => {
            children.parentComponent = this
        })
    }
}