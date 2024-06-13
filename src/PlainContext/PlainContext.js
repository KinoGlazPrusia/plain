export default class PlainContext {
    constructor(name, self) {
        this.name = `${name}Context`
        this.subscribers = []

        this.initialise()
        this.subscribe(self)
    }

    initialise() {
        sessionStorage.getItem(this.name)
            ? null
            : sessionStorage.setItem(this.name, JSON.stringify({}))
    }

    subscribe(self) {
        if (!this.subscribers.includes(self)) {
            this.subscribers.push(self)
        }
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

    propagate() {
        this.subscribers.forEach(component => {
            component.render()
        })
    }

    clear() {
        sessionStorage.removeItem(this.name)
    }

}

// Convertirlo a patrón singleton ¿?