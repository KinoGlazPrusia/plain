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
If you're not using a resolver you should import it with a relative path. Like this :
```javascript
import { PlainComponent } from 'node_modules/plain-reactive/src/index.js'
```
You can also import it with a CDN :
```javascript
import { PlainComponent } from 'https://cdn.jsdelivr.net/gh/KinoGlazPrusia/plain@main/src/index.js'
```
*Some issues have been reported with the CDN version such as some components not being rendered correctly. If you're having problems with it, you can try using the relative path instead.*

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
    <my-component></my-component>
    <!-- It's important to add the closing tag in order to make it work -->
</body>

</html>
```
### Now let's make it actually reactive!

## Adding state to our components
#### 1. First import PlainState
```javascript
import { PlainState } from 'plain-reactive'
```
If you're not using a resolver you should import it with a relative path. Like this :
```javascript
import { PlainState } from 'node_modules/plain-reactive/src/index.js'
```
You can also import it with a CDN :
```javascript
import { PlainState } from 'https://cdn.jsdelivr.net/gh/KinoGlazPrusia/plain@main/src/index.js'
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
If you're not using a resolver you should import it with a relative path. Like this :
```javascript
import { PlainSignal } from 'node_modules/plain-reactive/src/index.js'
```
You can also import it with a CDN :
```javascript
import { PlainSignal } from 'https://cdn.jsdelivr.net/gh/KinoGlazPrusia/plain@main/src/index.js'
```

#### 2. To habilitate signals in your component just add it to the constructor
```javascript 
class MyComponent extends PlainComponent
{
    constructor() {
        super('my-component', 'myComponent/myComponent.css')

        ...

        this.signals = new PlainSignal(this) 
        // The attribute has to be called 'this.signals' in order to work
        // The first parameter is a reference to your component
    }
...
```
#### There's 3 different things you can do with signals (register, emit, connect)
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
    <emitter id="emitter"></emitter>
    <receiver id="receiver"></receiver>
</body>

</html>
```
*index.js*
```javascript
const emitter = document.getElementById('emitter')
const receiver = document.getElementById('receiver')

receiver.signals.connect(emitter, 'clicked', receiver.handleSignal)
```
Now, each time the emitter button is clicked, the span content in the receiver
will update with the number of clicks.

## Using PlainContext
### You can use PlainContext to store data in a sessionStorage and access it from any component.
Sometimes you'll need to store some data across your whole application during the user's session. For example, you can use PlainContext to store the user's profile data, or the current user's token. That's where PlainContext comes in handy.

### Let's see an example!
You don't need to initialize the PlainContext in your main script. It will act as a singleton and will be initialized automatically when you first use it.

#### 1. First import PlainContext
```javascript
import { PlainContext } from 'plain-reactive'
```
If you're not using a resolver you should import it with a relative path. Like this :
```javascript
import { PlainContext } from 'node_modules/plain-reactive/src/index.js'
```
You can also import it with a CDN :
```javascript
import { PlainContext } from 'https://cdn.jsdelivr.net/gh/KinoGlazPrusia/plain@main/src/index.js'
```

#### 2. Then you'll have to initialise it inside the constructor of your component
```javascript
class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'myComponent/myComponent.css')

        /* You can use PlainContext to store data inside sessionStorage
        The data is stored as a JSON object. 
        
        Be aware that you can only store the same type of data that 
        sessionStorage can store.
        
        The first parameter is the name of the context, the second one is a 
        reference to your component */

        this.userContext = new PlainContext('user', this)
    }
    ...
```

#### 3. Then you can use the PlainContext methods to store and retrieve data
- **setData** (data, propagate)
- **getData** (key)
- **clear** ( )  *This method will clear the context from sessionStorage and delete the PlainContext instance*

```javascript
// You can store data in the context

/* It takes two parameters. 

The first one is the data you want to store.

The second one is a boolean that indicates if you want to re-render all the components that are using this context. 

Its default value is false. */
this.userContext.setData({ name: 'John Doe', age: 30 })

// You can also retrieve the data from the context
const userName = this.userContext.getData('name')
```
*If you need to check the keys you can allways take a look at the sessionStorage.*

#### With this you can render dinamically your components based on the data you store in the context.

#### 4. Then you can connect the components to the context by simply initialising the context with the same name.
```javascript
class MyOtherComponent extends PlainComponent {
    constructor() {
        super('my-other-component', 'myOtherComponent/myOtherComponent.css')

        this.userContext = new PlainContext('user', this)
    }
    ...
```

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
        this.$('#dynamic-btn').onclick = () => this.toogle()
    }

    toogle() {
        this.state.getState() === 'active'
            ? this.state.setState('disabled')
            : this.state.setState('active')
    }
}
```

## Patch Notes v.1.1.6
- Added a new attribute to the PlainComponent class called 'parentComponent' and a new method called 'adoption()' that will set the parentComponent attribute for all the children of the component. This is useful when you want to access the parent component from a child component and for example, to call a method of the parent component. The method is not public. It sets its children automatically every time the component is rendered.

- Added signal name suggestion in case that a signal name which is trying to be connected doesn't exists. (TODO)

- Some of the class methods have been defined as private.
