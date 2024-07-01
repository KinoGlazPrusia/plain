export default class PlainSignal {
    constructor(parent) {
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
            args ? conn.callback(args) : conn.element[conn.callback.name]()
        })
    }

    connect(emitter, signal, callback) {
        if (!emitter.signals.registered[signal]) {
            throw new Error(`${emitter}:'${signal}' signal does not exist.`)
        } else {
            emitter.signals.registered[signal].push({
                element: this.parent,
                callback: callback
            })
        }
    }

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

