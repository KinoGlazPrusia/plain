# Plain
Plain is a vanilla JavaScript library that provides the tools to easily and quickly build reusable reactive web components, eliminating the need to learn difficult frameworks or new syntax.

## Getting started with Plain!
### First, create a folder containing 2 files 
*(one for the style and the other for the component)*
+ myComponent/
    - myComponent.css
    - myComponent.js

### Build your first reactive web component in 5 easy steps
#### 1. Import PlainComponent class :
```javascript
import { PlainComponent } from 'plain-reactive'
```
If you're not using a bundler you should import it with a relative path. Like this :
```javascript
import { PlainComponent } from 'node_modules/plain-reactive/src/index.js'
```

#### 2. Initialize the component providing a name and specify the path to its stylesheet :
```javascript 
class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'myComponent/myComponent.css')
    }
```

#### 3. Define an HTML template using js template strings :
```javascript
    template() {
        return `
            <button class="my-btn">My button</button>
        `
    }
```

#### 4. Create event listeners for your component in a jQuery fashion
```javascript
    listeners() {
        this.$('.my-btn').onclick = () => console.log('Eureka!')
    }
}
```
*Notice that $() is a PlainComponent method that receives a selector as an argument. It can only access inner elements.*

#### 5. Define your component in the custom elements :
```javascript
export default customElements.define('my-component', MyComponent)
```
*The first parameter will be your HTML tag name.*

#### Here's the complete code snippet for this first component
*myComponent.js*
```javascript
import { PlainComponent } from 'plain-reactive'

class MyComponent extends PlainComponent
{
    constructor() {
        super('my-component', 'myComponent/myComponent.css')
    }

    template() {
        return `
            <button class="my-btn">My button</button>
        `
    }

    listeners() {
        this.$('.my-btn').onclick = () => console.log('Eureka!')
    }
}

export default customElements.define('my-component', MyComponent)
```
### Import the component in your main JavaScript file
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
### Now let's make it actually reactive!

## Adding state to our components
#### 1. First import PlainState
```javascript
import { PlainState } from 'plain-reactive'
```
If you're not using a bundler you should import it with a relative path. Like this :
```javascript
import { PlainState } from 'node_modules/plain-reactive/src/index.js'
```

#### 2. Then add any state you want in your component constructor
```javascript
class MyComponent extends PlainComponent
{
    constructor() {
        super('my-component', 'myComponent/myComponent.css')

        // You can use any kind of data on your states
        // The first parameter is the initial value of the state
        // The second one is a reference to your component
        this.count = new PlainState(1, this)
    }
...
```

You can add as many states as you want. Each state have 3 methods.
```javascript
this.count.getState() // Returns current state
this.count.setState(5 * 2) // Updates current state value
this.count.getPrevState() // Returns previous state once is updated
```
*Each time .setState() is called, the component's template is re-rendered.*

## Adding signals to our components
### Signals are a way to communicate elements between them
When a component emits a signal, all the components that previously connected to that
signal, execute a callback function.

#### 1. First import PlainSignal
```javascript
import { PlainSignal } from 'plain-reactive'
```
If you're not using a bundler you should import it with a relative path. Like this :
```javascript
import { PlainSignal } from 'node_modules/plain-reactive/src/index.js'
```

#### 2. To habilitate signals in your component just add it to the constructor
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
#### There's 3 different things you can do with signals
```javascript
this.signals.register('signal-name') 
// First of all register the signals you want the component to emit

this.signals.emit('signal-name') 
// You can call this method anywhere in your component logic or even retrieving the element from
// another script (with a query selection or similar using DOM)

this.signals.emit('signal-name', [1,2,3,4]) 
// You can add some arguments that will receive the receiver component as an argument for its callback

this.connect(emitter, 'signal-name', callback)
// When you connect to an components signal, each time that component emits the signal
// your element will execute the callback function you define here.
```

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

## Dynamic template rendering
### You can insert javascript code inside your template string to render it dynamically or conditionally. 
### Let's see an example!
We're going to build a simple example where we will have a component with a button that changes its styles and content each time is clicked without having to acces the classList through DOM.

```javascript
import { PlainComponent, PlainState } from 'plain-reactive'

class DynamicButton extends PlainComponent {
    construct() {
        super('dynamic-button', 'dynamicButton/dynamicButton.css')

        this.state = new PlainState('active', this)
    }

    template() {
        return `
            <button id="dynamic-btn" class="${this.state.getState()}">
                ${
                    this.state.getState() === 'active'
                        ? 'ON'
                        : 'OFF'
                }
            </button>
        `
    }

    listeners() {
        this.$('#dynamic-btn').onclick = () => tthis.toogle()
    }

    toogle() {
        this.state.getState() === 'active'
            ? this.state.setState('disabled')
            : this.state.setState('active')
    }
}
```

## Roadmap

- [ ] Implement PlainContext.
- [ ] Implement state propagation.
- [ ] Implement methods to get parents and siblings.