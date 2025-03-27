export default class PlainStyle {
    static instance = null

    constructor() {
        this.name = name
        const instance = this.constructor.instance

        if (instance) {
            return instance
        }

        this.styles = []

        PlainStyle.instance = this
    }

    registerCSS(name, url) {
        if (this.styles[name]) return // Si ya existe el estilo, no se carga nuevamente
        this.styles[name] = this.fetchCSS(url)
    }

    renderCSS(name) {
        if (!this.styles[name]) throw new Error(
            `The styles for ${name} have not been loaded. Please use the registerCSS method first to load the styles`
        )

        const style = document.createElement('style')
        style.textContent = this.styles[name]
        return style
    }

    fetchCSS(url) {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, false) 
        xhr.send()
        return xhr.responseText
    }
}