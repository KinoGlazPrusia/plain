export class PlainSignal {
    constructor() {
        this.registered = {}
    }

    register(signal) {
        if (!this.registered[signal]) this.registered[signal] = []
        else throw new Error(`'${signal}' signal already exists.`)
    }

    emit(signal, args=null) {
        const connections = this.registered[signal]
        connections.forEach(conn => {
            args ? conn.callback(args) : conn.callback()
        })
    }

    connect(emitter, signal, callback) {
        if (!emitter.signals.registered[signal]) {
            throw new Error(`${emitter}:'${signal}' signal does not exist.`)
        } else {
            emitter.signals.registered[signal].push({
                element: this,
                callback: callback
            })
        }
    }
}