export default class PlainContext {
    static instances = {}

    constructor(name, self) { // 'self' hace referencia al componente que usa el contexto
        this.name = `${name}Context`
        const context = PlainContext.instances[this.name]
        if (context) {
            context.subscribe(self)
            return context
        }

        this.subscribers = []

        this.initialise()
        this.subscribe(self)

        PlainContext.instances[this.name] = this
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

    setData(data, propagate=false) {
        // Data must be a JSON object
        let context = JSON.parse(sessionStorage.getItem(this.name))
        if (!context) return

        context = {...context, ...data}
        sessionStorage.setItem(this.name, JSON.stringify(context))

        // Context will propagate and re-render to all subscribed components
        propagate ? this.propagate(): null;
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
        delete PlainContext.instances[this.name]
    }
}