# Components

The PlainComponent class is the core of Plain's component system, allowing you to create reusable, encapsulated components.

## Creating Components with PlainComponent

### Basic Structure

A Plain component is a JavaScript class that extends the `PlainComponent` class:

```javascript
import { PlainComponent } from 'plain-reactive'

class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/MyComponent.css')
    }
    
    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div>
                <h1>My Component</h1>
                <p>This is a basic Plain component.</p>
            </div>
        `
    }
    
    listeners() {
        // Set up event listeners
    }
}

export default customElements.define('my-component', MyComponent)
```

### Constructor Parameters

The `PlainComponent` constructor takes up to two parameters:
1. `tagName`: The name of the custom element (required)
2. `cssPath`: Path to the component's CSS file (optional)

```javascript
constructor() {
    super('my-component', 'components/MyComponent/MyComponent.css')
}
```

To create a component without CSS:

```javascript
constructor() {
    super('my-component')
}
```

### Main Methods

PlainComponent provides several methods that you can override:

#### template()

Defines the HTML structure of the component:

```javascript
template() {
    // Use lit-html extension for HTML syntax highlighting
    return html`
        <div class="container">
            <h1 class="title">Hello, World!</h1>
            <div class="content">
                <p>This is a custom component.</p>
            </div>
        </div>
    `
}
```

#### listeners()

Sets up event listeners for elements within the component:

```javascript
listeners() {
    this.$('.button').onclick = () => this.handleClick()
    this.$('input').oninput = (e) => this.handleInput(e.target.value)
    this.$('form').onsubmit = (e) => {
        e.preventDefault()
        this.handleSubmit()
    }
}

handleClick() {
    console.log('Button clicked')
}

handleInput(value) {
    console.log('Input value:', value)
}

handleSubmit() {
    console.log('Form submitted')
}
```

#### render()

Renders the component to the DOM. This is called automatically when the component is created and when state changes:

```javascript
// Usually not necessary to override this method
render() {
    // Custom rendering logic if needed
    super.render()
    
    // Additional actions after rendering
    console.log('Component rendered')
}
```

### Lifecycle Methods

PlainComponent provides lifecycle methods that are called at different stages of the component's existence:

#### beforeRender()

Called just before the component is rendered:

```javascript
beforeRender() {
    console.log('Component will render')
    // Prepare data or perform actions before rendering
}
```

#### afterRender()

Called immediately after the component is rendered:

```javascript
afterRender() {
    console.log('Component has rendered')
    // Perform actions after rendering like initializing third-party libraries
    this.initializeCarousel()
}

initializeCarousel() {
    // Example of initializing a third-party component after render
    new Carousel(this.$('.carousel'))
}
```

#### elementConnected()

Called when the component is connected to the DOM:

```javascript
elementConnected() {
    console.log('Component connected to DOM')
    // Subscribe to events or start timers
    this.timer = setInterval(() => this.updateTime(), 1000)
}
```

#### elementDisconnected()

Called when the component is disconnected from the DOM:

```javascript
elementDisconnected() {
    console.log('Component disconnected from DOM')
    // Clean up resources
    clearInterval(this.timer)
}
```

### Selector Methods

PlainComponent provides methods to select elements within the component:

#### $()

Selects the first element matching the CSS selector:

```javascript
const button = this.$('.submit-button')
const input = this.$('#username')
const firstItem = this.$('li')
```

#### $$()

Selects all elements matching the CSS selector:

```javascript
const buttons = this.$$('button')
const items = this.$$('.item')
buttons.forEach(button => {
    button.onclick = () => this.handleButtonClick(button)
})
```

### Style Encapsulation

PlainComponent automatically encapsulates styles defined in the CSS file provided in the constructor:

```javascript
constructor() {
    super('my-component', 'components/MyComponent/MyComponent.css')
}
```

Styles in the CSS file will only apply to elements within this component. For more details, see the [Styles](./styles.md) documentation.

## Complete Example

Here's a complete example of a counter component:

```javascript
import { PlainComponent, PlainState } from 'plain-reactive'

class Counter extends PlainComponent {
    constructor() {
        super('my-counter', 'components/Counter/Counter.css')
        
        // Initialize state
        this.count = new PlainState(0, this)
        this.intervalId = null
        this.isRunning = false
    }
    
    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="counter">
                <h2>Counter Example</h2>
                
                <div class="display">${this.count.getState()}</div>
                
                <div class="buttons">
                    <button class="decrement">-</button>
                    <button class="increment">+</button>
                    <button class="reset">Reset</button>
                </div>
                
                <button class="auto">
                    ${this.isRunning ? 'Stop' : 'Start'} Auto Increment
                </button>
            </div>
        `
    }
    
    listeners() {
        this.$('.increment').onclick = () => this.increment()
        this.$('.decrement').onclick = () => this.decrement()
        this.$('.reset').onclick = () => this.reset()
        this.$('.auto').onclick = () => this.toggleAutoIncrement()
    }
    
    elementConnected() {
        console.log('Counter component connected')
    }
    
    elementDisconnected() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
        console.log('Counter component disconnected')
    }
    
    increment() {
        this.count.setState(this.count.getState() + 1)
    }
    
    decrement() {
        this.count.setState(this.count.getState() - 1)
    }
    
    reset() {
        this.count.setState(0)
    }
    
    toggleAutoIncrement() {
        if (this.isRunning) {
            clearInterval(this.intervalId)
            this.isRunning = false
        } else {
            this.intervalId = setInterval(() => this.increment(), 1000)
            this.isRunning = true
        }
        
        // Force re-render to update button text
        this.render()
    }
}

export default customElements.define('my-counter', Counter)
```

Use it in HTML:

```html
<my-counter></my-counter>
```

---

[Back to README](./README.md) 