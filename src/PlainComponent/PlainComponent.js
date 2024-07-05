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
        return wrapper
    }

    #setStyle(path) {
        const style = document.createElement('style')

        // Quizás se puede utilizar el método getDirectory() para que el usuario 
        // solamente tenga que especificar el nombre del archivo de estilos y 
        // automáticamente se busque en la carpeta en la que está definido el componente

        const xhr = new XMLHttpRequest() // Se utiliza XML... porque es síncrono
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
        this.#adoption()
        this.listeners()
        this.connectors()
    }

    template() {} // Devuelve el HTML con la estructura de la página

    listeners() {} // Asigna listeners a los elementos interactivos

    connectors() {} // Asigna conexiones entre los componentes hijo

    #adoption() {
        this.wrapper.querySelectorAll('*').forEach(children => {
            children.parentComponent = this
        })
    }
}