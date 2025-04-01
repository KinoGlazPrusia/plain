/**
 * TODO: Implementar funcionalidad completa del Router según la documentación en router.md
 * - Añadir gestión de rutas con parámetros (/productos/:id)
 * - Añadir gestión de rutas comodín (404)
 * - Añadir navegación programática
 * - Implementar gestión de título de página
 * - Añadir manejo de enlaces con data-link
 * - Permitir acceso a parámetros de ruta
 */
export default class PlainRouter {
    constructor(root) {
        this.root = root
    }

    parse() {
        return window.location.href.replace(this.root, '').replace(/\/$/, '');
    }

    route(routes) {
        if (this.parse() in routes) {
            return routes[this.parse()]
        } 
        return routes['*']
    }
}

