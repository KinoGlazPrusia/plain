export default class PlainContext {
    static instances = {}

    constructor(contextName, attachedComponent, suscribe = true) { // 'attachedComponent' hace referencia al componente que usa el contexto
        this.name = `${contextName}Context`
        const context = PlainContext.instances[this.name]
        if (context) {
            // Por defecto el propio componente se suscribe, pero en el caso de un proveedor como el 
            // componente raíz 'App' no debe suscribirse al contexto para no rerenderizarse con los cambios.
            suscribe && context.subscribe(attachedComponent)
            return context
        }

        this.subscribers = []

        this.#initialise()
        suscribe && this.subscribe(attachedComponent)

        PlainContext.instances[this.name] = this
    }

    #initialise() {
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
        propagate ? this.#propagate(): null; // Se puede sustituir por la sintaxis propagate && this.propagate() ?
    }

    getData(key) {
        return JSON.parse(sessionStorage.getItem(this.name))[key] 
    }

    #propagate() {
        this.subscribers.forEach(component => {
            component.render()
        })
    }

    clear() {
        sessionStorage.removeItem(this.name)
        delete PlainContext.instances[this.name]
    }
}