# Plain
Plain is a vanilla JS library that provides the tools to easily and quickly build reusable reactive web components, without having to learn difficult frameworks or new syntaxis.

## Getting started with Plain!
### First create a folder containing 2 files 
*(one for the style and the other for the component)*
+ myComponent/
    - myComponent.css
    - myComponent.js
### Just 4 easy steps to make your first reactive web component.
*myComponent.js*
```javascript
import { PlainComponent } from 'plain-reactive'

class MyComponent extends PlainComponent
{
    // 1. Initialise the component with a name and a path to its styles
    constructor() {
        super('my-component', 'myComponent/myComponent.css')
    }

    // 2. Create a template for the component HTML
    template() {
        return `
            <button class="my-btn">My button</button>
        `
    }

    // 3. Create event listeners for your component in a jQuery fashion
    listeners() {
        this.$('.my-btn').onclick = () => console.log('Eureka!')
    }
}

// 4. Export it so you can use it in your HTML 
export default customElements.define('my-component', MyComponent)
// The first parameter will be your HTML tag name
```
### Import the component on your entry point ( *index.js* in this case )
*index.js*
```javascript
import myComponent from 'myComponent/myComponent.js'
```

### And now you're ready to use your component wherever you want
*index.html*
```html
<!DOCTYPE html>
<html>

<head>
    <script type="module" src="index.js"></script>
</head>

<body>
    <my-component/>
</body>

</html>
```
### Now let's make it actually reactive...
## Adding state to our components
### First import PlainState
```javascript
import { PlainState } from 'plain-reactive'
```
### Then add any state you want in your component constructor
```javascript
class MyComponent extends PlainComponent
{
    constructor() {
        super('my-component', 'myComponent/myComponent.css')

        // You can use any kind of data on your states
        this.count = new PlainState(1, this)
        // The first parameter is the initial value of the state
        // The second one is a reference to your component
    }
...
```
### You can add as many states as you want. Each state have 3 methods.
```javascript
this.count.getState() // Returns current state
this.count.setState(5 * 2) // Updates current state value
this.count.getPrevState() // Returns previous state once is updated
```
*Each time .setState() is called, the component's template is re-rendered.*
## Adding signals to our components
### First import PlainSignal
```javascript
import { PlainSignal } from 'plain-reactive'
```
### Signals are a way to communicate elements between them
When an element emits a signal, all components that previously connected to that
signal, execute a callback function.
### To habilitate signals in your component just add it to the constructor
```javascript 
class MyComponent extends PlainComponent
{
    constructor() {
        super('my-component', 'myComponent/myComponent.css')

        ...

        this.signals = new PlainSignal() 
        // The attribute has to be called 'this.signals' in order to work
    }
...
```
### There's 3 different things you can do with signals
```javascript
this.signals.register('signal-name') 
// First of all register the signals you want the component to emit

this.signals.emit('signal-name') 
// Anywhere in your component logic or even retrieving the element from
// another script (with a query selection or similar using DOM), you can call this functions.

this.signals.emit('signal-name', [1,2,3,4]) 
// You can add some arguments that will receive the receiver as arguments for it's callback

this.connect(emitter, 'signal-name', callback)
// When you connect to an element signal, each time that element emits the signal
// your element will execute the callback function you define here.
```
### That's almost everything (there's another module in progress PlainContext)

## Example with state and signals
*emitter.js*
```javascript
import { PlainComponent, PlainSignal, PlainState } from 'plain-reactive'

class Emitter extends PlainComponent
{
    constructor() {
        super('emitter', 'emitter/emitter.css')

        // Signals
        this.signals = new PlainSignal()
        this.signals.register('clicked')
    }

    template() {
        return `
            <button class="my-btn">Click me!</button>
        `
    }

    listeners() {
        this.$('.my-btn').onclick = () => handleClick()
    }

    handleClick() {
        this.signals.emit('clicked')
    }
}

export default customElements.define('emitter', Emitter)
```
*receiver.js*
```javascript
class Receiver extends PlainComponent
{
    constructor() {
        super('receiver', 'receiver/receiver.css')

        // States
        this.clicks = new PlainState(0, this)

        // Signals
        this.signals = new PlainSignal()
    }

    template() {
        return `
            <span>The button have been clicked ${this.clicks.getState()} times.</span>
        `
    }

    handleSignal() {
        this.clicks.setState(this.clicks.getState() + 1)
    }
}

export default customElements.define('receiver', Receiver)
```
### Then you can connect both elements on the main script
*index.html*
```html
<!DOCTYPE html>
<html>

<head>
    <script type="module" src="index.js"></script>
</head>

<body>
    <emitter id="emitter"/>
    <receiver id="receiver"/>
</body>

</html>
```
*index.js*
```javascript
const emitter = document.getElementById('emitter')
const receiver = document.getElementById('receiver')

receiver.signals.connect(emitter, 'clicked', receiver.handleSignal())
```
Now, each time the emitter button is clicked, the span content in the receiver
will update with the number of clicks.

## Roadmap

- [ ] Implement PlainContext.
- [ ] Implement state propagation.
- [ ] Implement methods to get parents and siblings.