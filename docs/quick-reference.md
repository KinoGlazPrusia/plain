# Plain Reactive - Quick Reference

> Fast lookup for all APIs and methods

## Import Statement

```javascript
import { 
    PlainComponent, 
    PlainState, 
    PlainSignal, 
    PlainContext, 
    PlainRouter, 
    PlainStyle 
} from 'plain-reactive'
```

## PlainComponent

### Constructor & Core Methods
```javascript
class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/styles.css')
    }
    
    template() { return `<div>HTML</div>` }
    listeners() { /* Event handlers */ }
    connectors() { /* Signal connections */ }
    render(forceFullRender, logChanges, logTime) { /* Manual render */ }
}
```

### Selector Methods
```javascript
this.$('.selector')     // First element
this.$$('.selector')    // All elements
```

### Lifecycle Methods
```javascript
elementConnected()      // On DOM connect
elementDisconnected()   // On DOM disconnect
beforeRender()          // Before each render
afterRender()           // After each render
```

### Properties
```javascript
this.name               // Component name
this.shadow            // Shadow DOM root
this.wrapper           // Main wrapper element
this.parentComponent   // Parent component reference
```

---

## PlainState

### Basic Usage
```javascript
// Create state
this.count = new PlainState(0, this)

// Read state
const value = this.count.getState()

// Update state
this.count.setState(newValue)            // With re-render
this.count.setState(newValue, false)     // Without re-render

// Previous state
const prev = this.count.getPrevState()
```

---

## PlainSignal

### Setup & Registration
```javascript
// Initialize
this.signals = new PlainSignal(this)

// Register signals to emit
this.signals.register('my-signal')
this.signals.register('data-changed')
```

### Emit & Connect
```javascript
// Emit signal
this.signals.emit('my-signal')
this.signals.emit('my-signal', data)

// Connect to signal
this.signals.connect(emitterComponent, 'signal-name', callback)
this.signals.connect(emitterComponent, 'signal-name', this.handleSignal.bind(this))
```

---

## PlainContext

### Create Context
```javascript
// Session storage (default)
this.userContext = new PlainContext('user', this)

// Local storage
this.settingsContext = new PlainContext('settings', this, true, 'local')

// No auto-subscribe
this.dataContext = new PlainContext('data', this, false)
```

### Data Operations
```javascript
// Set data
this.userContext.setData({name: 'John', age: 30})
this.userContext.setData({theme: 'dark'}, true)  // With propagation

// Get data
const name = this.userContext.getData('name')
const theme = this.userContext.getData('theme')

// Clear context
this.userContext.clear()
```

---

## PlainRouter

### Basic Usage
```javascript
// Create router
const router = new PlainRouter(window.location.origin)

// Parse current route
const currentPath = router.parse()

// Route matching
const routes = {
    '/': () => showHome(),
    '/about': () => showAbout(),
    '*': () => show404()
}
const handler = router.route(routes)
handler()
```

---

## PlainStyle

### CSS Management
```javascript
const style = new PlainStyle()

// Register CSS
style.registerCSS('component-name', 'path/to/styles.css')

// Render CSS element
const styleElement = style.renderCSS('component-name')

// Fetch CSS content
const cssContent = style.fetchCSS('path/to/styles.css')
```

---

## Common Patterns

### Component with State
```javascript
class Counter extends PlainComponent {
    constructor() {
        super('counter')
        this.count = new PlainState(0, this)
    }
    
    template() {
        return `
            <div>
                <span>${this.count.getState()}</span>
                <button class="inc">+</button>
            </div>
        `
    }
    
    listeners() {
        this.$('.inc').onclick = () => 
            this.count.setState(this.count.getState() + 1)
    }
}
```

### Component with Signals
```javascript
class Publisher extends PlainComponent {
    constructor() {
        super('publisher')
        this.signals = new PlainSignal(this)
        this.signals.register('message-sent')
    }
    
    sendMessage(text) {
        this.signals.emit('message-sent', {text, timestamp: Date.now()})
    }
}

class Subscriber extends PlainComponent {
    constructor() {
        super('subscriber')
        this.signals = new PlainSignal(this)
    }
    
    connectors() {
        const publisher = document.querySelector('publisher')
        this.signals.connect(publisher, 'message-sent', this.handleMessage.bind(this))
    }
    
    handleMessage(data) {
        console.log('Received:', data.text)
    }
}
```

### Component with Context
```javascript
class UserProfile extends PlainComponent {
    constructor() {
        super('user-profile')
        this.userContext = new PlainContext('user', this, true)
    }
    
    template() {
        const name = this.userContext.getData('name') || 'Guest'
        return `<h1>Hello, ${name}</h1>`
    }
    
    login(userData) {
        this.userContext.setData(userData, true)  // Propagate to other components
    }
}
```

---

## Event Handler Patterns

### Basic Events
```javascript
listeners() {
    this.$('button').onclick = () => this.handleClick()
    this.$('input').oninput = (e) => this.handleInput(e.target.value)
    this.$('form').onsubmit = (e) => {
        e.preventDefault()
        this.handleSubmit()
    }
}
```

### Multiple Elements
```javascript
listeners() {
    this.$$('.tab').forEach((tab, index) => {
        tab.onclick = () => this.selectTab(index)
    })
    
    this.$$('.delete-btn').forEach(btn => {
        btn.onclick = () => this.deleteItem(btn.dataset.id)
    })
}
```

---

## State Update Patterns

### Simple Updates
```javascript
// Primitive values
this.count.setState(this.count.getState() + 1)
this.name.setState('New Name')
this.active.setState(!this.active.getState())
```

### Object Updates
```javascript
// Merge objects
const user = this.user.getState()
this.user.setState({...user, name: 'New Name'})

// Replace object
this.user.setState({id: 1, name: 'John', email: 'john@example.com'})
```

### Array Updates
```javascript
// Add item
const items = this.items.getState()
this.items.setState([...items, newItem])

// Remove item
const items = this.items.getState()
this.items.setState(items.filter(item => item.id !== removeId))

// Update item
const items = this.items.getState()
this.items.setState(items.map(item => 
    item.id === updateId ? {...item, ...updates} : item
))
```

---

## Performance Tips

### Batch Updates
```javascript
// Avoid multiple renders
this.count.setState(newCount, false)
this.name.setState(newName, false)
this.active.setState(newActive, false)
this.render() // Single render

// Or update together
this.updateMultipleStates()
```

### Conditional Rendering
```javascript
template() {
    if (this.loading.getState()) return '<div>Loading...</div>'
    if (this.error.getState()) return '<div>Error occurred</div>'
    return this.renderContent()
}
```

### Efficient Signal Connections
```javascript
connectors() {
    // Cache component references
    const userForm = this.$('user-form')
    const userProfile = this.$('user-profile')
    
    // Connect once
    this.signals.connect(userForm, 'user-updated', userProfile.updateUser.bind(userProfile))
}
```

---

## Custom Element Registration

```javascript
// Standard registration
customElements.define('my-component', MyComponent)

// Export for use
export default customElements.define('my-component', MyComponent)

// Use in HTML
// <my-component></my-component>
```

---

## Common Methods Summary

| Class | Method | Purpose |
|-------|--------|---------|
| `PlainComponent` | `template()` | Define HTML structure |
| `PlainComponent` | `listeners()` | Set up event handlers |
| `PlainComponent` | `connectors()` | Connect signals |
| `PlainComponent` | `render()` | Trigger re-render |
| `PlainComponent` | `$()` / `$$()` | Query elements |
| `PlainState` | `getState()` | Get current value |
| `PlainState` | `setState()` | Update value |
| `PlainState` | `getPrevState()` | Get previous value |
| `PlainSignal` | `register()` | Register signal |
| `PlainSignal` | `emit()` | Send signal |
| `PlainSignal` | `connect()` | Listen to signal |
| `PlainContext` | `setData()` | Store data |
| `PlainContext` | `getData()` | Retrieve data |
| `PlainContext` | `clear()` | Clear context |
| `PlainRouter` | `parse()` | Get current route |
| `PlainRouter` | `route()` | Match routes |
| `PlainStyle` | `registerCSS()` | Register styles |
| `PlainStyle` | `renderCSS()` | Create style element |