export default class PlainState {
    #component	
    #lastState
    #currentState

    constructor(initialValue, component) {
        this.#component = component
        this.#lastState = initialValue
        this.#currentState = initialValue
    }

    setState(nextState, propagate = true) {
        this.#lastState = this.#currentState
        this.#currentState = nextState

        propagate && this.#component.render()
    }

    getState() {
        return this.#currentState
    }

    getPrevState() {
        return this.#lastState
    }
}