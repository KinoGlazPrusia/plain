# State

Plain provides a reactive state management system through the `PlainState` class, which allows components to automatically update when their state changes.

## Basic Usage of PlainState

### Initialization

```javascript
import { PlainComponent, PlainState } from 'plain-reactive'

class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/MyComponent.css')
        
        // Initialize a state with an initial value
        this.counter = new PlainState(0, this)
        this.name = new PlainState('User', this)
        this.active = new PlainState(false, this)
        this.items = new PlainState([1, 2, 3], this)
    }
    
    // ...
}
```

The PlainState constructor takes two parameters:
- `initialValue`: The initial value of the state (can be any data type)
- `component`: Reference to the component that owns the state (usually `this`)

### Accessing Current State

To access the current value of the state, use the `getState()` method:

```javascript
template() {
    // Use lit-html extension for HTML syntax highlighting
    return html`
        <div>
            <h1>Counter: ${this.counter.getState()}</h1>
            <p>Name: ${this.name.getState()}</p>
            <p>Status: ${this.active.getState() ? 'Active' : 'Inactive'}</p>
            <ul>
                ${this.items.getState().map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `
}
```

### Updating State

To update the state, use the `setState()` method:

```javascript
increment() {
    this.counter.setState(this.counter.getState() + 1)
}

changeName(newName) {
    this.name.setState(newName)
}

toggleActive() {
    this.active.setState(!this.active.getState())
}

addItem(item) {
    const currentItems = this.items.getState()
    this.items.setState([...currentItems, item])
}
```

Each time `setState()` is called, the component is automatically re-rendered.

### Accessing Previous State

PlainState also keeps track of the previous state value. To access it, use the `getPrevState()` method:

```javascript
changeAndShowDifference(newValue) {
    this.counter.setState(newValue)
    const difference = this.counter.getState() - this.counter.getPrevState()
    console.log(`The counter changed by ${difference}`)
}
```

### Preventing Automatic Updates

The `setState()` method accepts an optional second parameter that indicates whether to propagate the change (re-render the component). By default it's `true`, but you can set it to `false` if you want to make multiple changes without updating the component immediately:

```javascript
updateWithoutRendering() {
    // Update without re-rendering
    this.counter.setState(this.counter.getState() + 1, false)
    this.name.setState('New name', false)
    
    // Force rendering manually
    this.render()
}
```

## Complete Example

```javascript
import { PlainComponent, PlainState } from 'plain-reactive'

class UserForm extends PlainComponent {
    constructor() {
        super('user-form', 'components/UserForm/UserForm.css')
        
        // Initial states
        this.name = new PlainState('', this)
        this.email = new PlainState('', this)
        this.age = new PlainState(18, this)
        this.errors = new PlainState({}, this)
    }

    template() {
        const errors = this.errors.getState()
        
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <form class="form">
                <div class="field">
                    <label for="name">Name:</label>
                    <input id="name" type="text" value="${this.name.getState()}">
                    ${errors.name ? `<p class="error">${errors.name}</p>` : ''}
                </div>
                
                <div class="field">
                    <label for="email">Email:</label>
                    <input id="email" type="email" value="${this.email.getState()}">
                    ${errors.email ? `<p class="error">${errors.email}</p>` : ''}
                </div>
                
                <div class="field">
                    <label for="age">Age:</label>
                    <input id="age" type="number" value="${this.age.getState()}">
                    ${errors.age ? `<p class="error">${errors.age}</p>` : ''}
                </div>
                
                <button type="button" class="submit">Submit</button>
            </form>
        `
    }

    listeners() {
        this.$('#name').oninput = (e) => this.name.setState(e.target.value)
        this.$('#email').oninput = (e) => this.email.setState(e.target.value)
        this.$('#age').oninput = (e) => this.age.setState(parseInt(e.target.value) || 0)
        this.$('.submit').onclick = () => this.validateAndSubmit()
    }
    
    validateAndSubmit() {
        const errors = {}
        
        if (this.name.getState().trim() === '') {
            errors.name = 'Name is required'
        }
        
        if (!this.email.getState().includes('@')) {
            errors.email = 'Email is not valid'
        }
        
        if (this.age.getState() < 18) {
            errors.age = 'You must be at least 18 years old'
        }
        
        this.errors.setState(errors)
        
        if (Object.keys(errors).length === 0) {
            // No errors, we can process the form
            console.log('Form submitted:', {
                name: this.name.getState(),
                email: this.email.getState(),
                age: this.age.getState()
            })
        }
    }
}

export default customElements.define('user-form', UserForm)
```

Use it in HTML:

```html
<user-form></user-form>
```

---

[Back to README](./README.md) 