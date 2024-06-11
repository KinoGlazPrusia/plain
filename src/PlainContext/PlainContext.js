export default class PlainContext {
    constructor(name, role) {
        this.name = `${name}Context`
        this.initialise()
    }

    initialise() {
        sessionStorage.getItem(this.name)
            ? null
            : sessionStorage.setItem(this.name, JSON.stringify({}))
    }

    setData(data) {
        // Data must be a JSON object
        let context = JSON.parse(sessionStorage.getItem(this.name))
        if (!context) return

        context = {...context, ...data}
        sessionStorage.setItem(this.name, JSON.stringify(context))
    }

    getData(key) {
        return JSON.parse(sessionStorage.getItem(this.name))[key]
    }

    clear() {
        sessionStorage.removeItem(this.name)
    }
}