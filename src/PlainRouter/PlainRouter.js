import { PlainComponent } from '../PlainComponent/PlainComponent.js'

// Este componente ha de ser llamado siempre desde App, con lo que todas las request 
// al servidor se han de redirigir hacia index.html donde tendremos el componente raíz
// <p-app> y hemos de conservar de alguna manera la url recibida para poder parsear
// las direcciones. A partir de aquí el componente <p-app> se renderiza usando un componente
// de página (la página correspondiente).

class PlainRouter extends PlainComponent {
    constructor() {
        super('plain-router', '')   
    }

    template() {
        switch (route) {
            case '/':
                return `<p-index></p-index>`
                break
            case 'home':
                return `<p-home></p-home>`
                break
            case 'orders':
                return `<p-orders></p-orders>`
        }
    }
}