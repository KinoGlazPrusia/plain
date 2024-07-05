export default class PlainSignal {
    constructor(parent) {
        if (!parent) throw new Error('You need to specify the parent of the signal. Use \'this\' as default.')
        this.parent = parent
        this.registered = {}
    }

    register(signal) {
        if (!this.registered[signal]) this.registered[signal] = []
        else throw new Error(`'${signal}' signal already exists.`)
    }

    emit(signal, args=null) {
        const connections = this.registered[signal]
        connections.forEach(conn => {
            if (!conn.element[conn.callback.name]) { // Si el callback es una función anónima
                args ? conn.callback(args) : conn.callback()
            } else { // Si el callback es un método del componente
                args ? conn.element[conn.callback.name](args) : conn.element[conn.callback.name]()
            }
        })
    }

    connect(emitter, signal, callback) {
        if (!emitter.signals.registered[signal]) {
            throw new Error(`${emitter}:'${signal}' signal does not exist. Maybe you're trying to connect to ${this.#similarSignal(signal)}...`)
        } else {
            emitter.signals.registered[signal].push({
                element: this.parent,
                callback: callback
            })
        }
    }

    /* TODO: Make this function work properly */
    #similarSignal(signal) {
        let matches = []
        this.registered.keys().forEach(key => {
            let counter = 0;
            signal.split().forEach((char, index) => {
                if (key.length - 1 <= index) {
                    if (key[index] === char) counter++
                }
            })
            matches[key] = counter
        })
        
        let mostSimilar = null
        let maxOccurences = 0
        matches.forEach((key, value) => {
            if (value > maxOccurences) {
                maxOccurences = value
                mostSimilar = key
            }
        })

        return mostSimilar
    }
}

