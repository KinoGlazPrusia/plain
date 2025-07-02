export default class PlainContext {
    static instances = {}

    constructor(
        contextName, 
        attachedComponent, // 'attachedComponent' refers to the component that uses this context
        suscribe = true, 
        location='session'
    ) { 
        this.name = `${contextName}Context`
        
        const context = PlainContext.instances[this.name]
        if (context) {
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
        switch(this.location) {
            case 'session':
                sessionStorage.getItem(this.name)
                    ? null
                    : sessionStorage.setItem(this.name, JSON.stringify({}))
                break

            case 'local':
                localStorage.getItem(this.name)
                    ? null
                    : localStorage.setItem(this.name, JSON.stringify({}))
                break

            default:
                throw new Error('Invalid location. Session and local are the only valid locations.')
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
        
        propagate && this.#propagate() // Context will propagate and re-render to all subscribed components
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