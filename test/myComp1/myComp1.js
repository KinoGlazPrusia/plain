import {PlainComponent, PlainSignal} from '../../src/index.js'

class myComp1 extends PlainComponent {
    constructor() {
        super('my-comp-1', 'myComp1/myComp1.css')

        this.signals = new PlainSignal(this)
        this.signals.register('clicked')
    }

    template() {
        return `
            <button class="my-btn-1">My Button 1</button>
        `
    }

    listeners () {
        this.$('.my-btn-1').onclick = () => console.log(this.signals)
    }
}

export default customElements.define('my-comp-1', myComp1)