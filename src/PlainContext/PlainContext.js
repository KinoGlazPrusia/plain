export default class PlainContext {
    static instances = {}

    constructor(contextName, attachedComponent, suscribe = true, location='session') { // 'attachedComponent' hace referencia al componente que usa el contexto
        this.name = `${contextName}Context`
        const context = PlainContext.instances[this.name]
        if (context) {
            // Por defecto el propio componente se suscribe, pero en el caso de un proveedor como el 
            // componente raíz 'App' no debe suscribirse al contexto para no rerenderizarse con los cambios.
            suscribe && context.subscribe(attachedComponent)
            return context
        }

        this.subscribers = []
        this.location = location

        this.#initialise()
        suscribe && this.subscribe(attachedComponent)

        PlainContext.instances[this.name] = this
    }

    #initialise() {
        // For session storage
        if (this.location === 'session') {
            sessionStorage.getItem(this.name)
                ? null
                : sessionStorage.setItem(this.name, JSON.stringify({}))
        }

        // For local storage
        else if (this.location === 'local') {
            localStorage.getItem(this.name)
                ? null
                : localStorage.setItem(this.name, JSON.stringify({}))
        }
    }

    #propagate() {
        this.subscribers.forEach(component => {
            component.render()
        })
    }

    subscribe(self) {
        if (!this.subscribers.includes(self)) {
            this.subscribers.push(self)
        }
    }

    setData(data, propagate=false) {
        if (this.location === 'session') {
            // Data must be a JSON object
            let context = JSON.parse(sessionStorage.getItem(this.name))
            if (!context) return

            context = {...context, ...data}
            sessionStorage.setItem(this.name, JSON.stringify(context))
        } 
        
        else if (this.location === 'local') {
            // Data must be a JSON object
            let context = JSON.parse(localStorage.getItem(this.name))
            if (!context) return

            context = {...context, ...data}
            localStorage.setItem(this.name, JSON.stringify(context))
        }

        // Context will propagate and re-render to all subscribed components
        propagate && this.#propagate()
    }

    getData(key) {
        return this.location === 'session' 
            ? JSON.parse(sessionStorage.getItem(this.name))[key]
            : JSON.parse(localStorage.getItem(this.name))[key]
    }

    clear() {
        if (this.location === 'session') {
            sessionStorage.removeItem(this.name)
        }

        else if (this.location === 'local') {
            localStorage.removeItem(this.name)
        }

        delete PlainContext.instances[this.name]
    }
}