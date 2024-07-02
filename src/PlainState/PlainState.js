export default class PlainState {
    constructor(initialValue, component) {
        this.component = component
        this.lastState = initialValue
        this.currentState = initialValue
    }

    setState(nextState, propagate = true) {
        // Implementar un sistema para poder acceder al estado previo directamente
        this.lastState = this.currentState
        this.currentState = nextState

        this.component.render()
    }

    getState() {
        return this.currentState
    }

    getPrevState() {
        return this.lastState
    }
}