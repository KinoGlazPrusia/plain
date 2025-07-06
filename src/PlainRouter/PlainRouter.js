export default class PlainRouter {
    constructor(root, app) {
        this.root = root
        this.app = app

        this.routes = {}
        this.currentRoute = window.location.pathname

        this.init()
    }

    init() {
        window.onpopstate = () => this.handleRouteChange()
    }

    navigateTo(path) {
        window.history.pushState(null, null, path)
        this.handleRouteChange()
    }

    handleRouteChange() {
        const path = window.location.pathname || '/'
        this.currentRoute = path
        this.app.render(true)
    }

    parse() {
        return window.location.pathname
    }

    setup(routes) {
        const path = this.parse()
        if (path in routes) {
            return routes[path] 
        } 
        return routes['*']
    }
}
