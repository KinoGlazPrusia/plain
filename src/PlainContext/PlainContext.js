export class PlainContext {
    constructor(name, role) {
        this.name = `${name}Context`
        this.role = role
        this.initialise()
    }

    initialise() {
        this.role === 'consumer' // or 'provider'
            ? sessionStorage.setItem(this.name, JSON.stringify({}))
            : null
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