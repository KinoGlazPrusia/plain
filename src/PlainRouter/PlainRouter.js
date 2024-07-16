export default class PlainRouter {
    constructor(root) {
        this.root = root
    }

    parse() {
        return window.location.href.replace(this.root, '')
    }

    route(routes) {
        if (this.parse() in routes) {
            return routes[this.parse()]
        } 
        return routes['*']
    }
}

