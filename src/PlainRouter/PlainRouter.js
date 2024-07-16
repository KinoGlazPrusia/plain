import { PlainComponent } from '../PlainComponent/PlainComponent.js'

// Este componente ha de ser llamado siempre desde App, con lo que todas las request 
// al servidor se han de redirigir hacia index.html donde tendremos el componente raíz
// <p-app> y hemos de conservar de alguna manera la url recibida para poder parsear
// las direcciones. A partir de aquí el componente <p-app> se renderiza usando un componente
// de página (la página correspondiente).

// Necesitaríamos un estado que almacene la ruta (breadcrumb).

// Las rutas hijas heredan la ruta padre para concatenar.
/* 
<p-route index path="/" component="pApp.js">                                   .../
    <p-route path="home" component="pHome.js">                                 .../home
        <p-route path="dashboard" component="pDashboard.js"></p-route>         .../home/dashboard
    </p-route>
    <p-route path="config" component="pConfig.js"></p-route>                   .../config
    <p-route path="orders" component="pOrders.js">                             .../orders
        <p-route path="pending" component="pPendingOrders.js"></p-route>       .../orders/pending
        <p-route path="completed" component="pCompletedOrders.js"></p-route>   .../orders/completed
    </p-route>               
</p-route>
*/

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