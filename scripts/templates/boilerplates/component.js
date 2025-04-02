import { PlainComponent, PlainState, PlainSignal, PlainContext, PlainRouter} from 'plain-reactive'

class {{CLASS_NAME}} extends PlainComponent {
    constructor() {
        // The relative path is from the entry point of the App (index.html)
        super(`plain-{{COMPONENT_NAME}}`, `{{RELATIVE_CSS_PATH}}`)
    }

    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <!-- Here you can define the HTML structure of the component dynamically -->
        `
    }

    listeners() {
        // Here you can define the listeners for the component inner elements
    }

    connectors() {
        // Here you can define the connections between the components through signals
    }
}

export default window.customElements.define('plain-{{COMPONENT_NAME}}', {{CLASS_NAME}}) 