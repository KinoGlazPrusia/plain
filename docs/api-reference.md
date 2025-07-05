# Plain Reactive - Complete API Reference

> Comprehensive documentation for all public APIs, functions, and components

## Table of Contents

- [Installation](#installation)
- [PlainComponent](#plaincomponent)
- [PlainState](#plainstate)
- [PlainSignal](#plainsignal)
- [PlainContext](#plaincontext)
- [PlainRouter](#plainrouter)
- [PlainStyle](#plainstyle)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

---

## Installation

```bash
npm install plain-reactive
```

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

---

## PlainComponent

The core class for creating reusable web components with Shadow DOM encapsulation.

### Constructor

```javascript
new PlainComponent(componentName, stylePath)
```

**Parameters:**
- `componentName` (string): Name for the custom element
- `stylePath` (string, optional): Path to CSS file for component styles

**Example:**
```javascript
class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'components/MyComponent/styles.css')
    }
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Component name |
| `parentComponent` | PlainComponent | Reference to parent component |
| `shadow` | ShadowRoot | Shadow DOM root |
| `wrapper` | HTMLElement | Main wrapper element |
| `signals` | PlainSignal | Signal system instance |

### Methods

#### Core Methods

##### `template()`
Defines the HTML structure of the component.

```javascript
template() {
    return `
        <div class="container">
            <h1>${this.title}</h1>
            <button class="action-btn">Click me</button>
        </div>
    `
}
```

##### `render(forceFullRender = false, logRenderChanges = true, logRenderTime = false)`
Renders the component to the DOM.

**Parameters:**
- `forceFullRender` (boolean): Force complete re-render
- `logRenderChanges` (boolean): Log DOM changes
- `logRenderTime` (boolean): Log render performance

```javascript
// Manual render with full re-render
this.render(true)

// Render with performance logging
this.render(false, true, true)
```

##### `listeners()`
Sets up event listeners for component elements.

```javascript
listeners() {
    this.$('.action-btn').onclick = () => this.handleClick()
    this.$('input').oninput = (e) => this.handleInput(e.target.value)
}
```

##### `connectors()`
Establishes connections between components (signals).

```javascript
connectors() {
    const childComponent = this.$('child-component')
    this.signals.connect(childComponent, 'data-changed', this.handleDataChange)
}
```

#### Selector Methods

##### `$(selector)`
Selects the first element matching the CSS selector.

```javascript
const button = this.$('.submit-btn')
const input = this.$('#username')
```

##### `$$(selector)`
Selects all elements matching the CSS selector.

```javascript
const buttons = this.$$('button')
const items = this.$$('.list-item')
```

#### Lifecycle Methods

##### `elementConnected()`
Called when component is connected to the DOM.

```javascript
elementConnected() {
    console.log('Component connected')
    this.startTimer()
}
```

##### `elementDisconnected()`
Called when component is disconnected from the DOM.

```javascript
elementDisconnected() {
    console.log('Component disconnected')
    this.cleanup()
}
```

##### `beforeRender()`
Called before each render.

```javascript
beforeRender() {
    this.prepareData()
}
```

##### `afterRender()`
Called after each render.

```javascript
afterRender() {
    this.initializePlugins()
}
```

#### Utility Methods

##### `html(strings, ...values)`
Template literal helper for HTML strings.

```javascript
const content = this.html`
    <div>
        <h1>${title}</h1>
        <p>${description}</p>
    </div>
`
```

### Complete Component Example

```javascript
class TodoItem extends PlainComponent {
    constructor() {
        super('todo-item', 'components/TodoItem/TodoItem.css')
        
        this.completed = new PlainState(false, this)
        this.text = new PlainState('', this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('todo-completed')
        this.signals.register('todo-deleted')
    }
    
    template() {
        return `
            <div class="todo-item ${this.completed.getState() ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${this.completed.getState() ? 'checked' : ''}>
                <span class="text">${this.text.getState()}</span>
                <button class="delete-btn">Delete</button>
            </div>
        `
    }
    
    listeners() {
        this.$('.checkbox').onchange = (e) => this.toggleComplete(e.target.checked)
        this.$('.delete-btn').onclick = () => this.deleteTodo()
    }
    
    toggleComplete(checked) {
        this.completed.setState(checked)
        this.signals.emit('todo-completed', {
            id: this.id,
            completed: checked
        })
    }
    
    deleteTodo() {
        this.signals.emit('todo-deleted', { id: this.id })
    }
    
    setData(id, text, completed = false) {
        this.id = id
        this.text.setState(text)
        this.completed.setState(completed)
    }
}

customElements.define('todo-item', TodoItem)
```

---

## PlainState

Reactive state management with automatic re-rendering.

### Constructor

```javascript
new PlainState(initialValue, component)
```

**Parameters:**
- `initialValue` (any): Initial state value
- `component` (PlainComponent): Component that owns this state

### Methods

#### `getState()`
Returns the current state value.

```javascript
const count = this.counter.getState()
```

#### `setState(nextState, propagate = true)`
Updates the state value.

**Parameters:**
- `nextState` (any): New state value
- `propagate` (boolean): Whether to trigger re-render

```javascript
// Update with re-render
this.counter.setState(this.counter.getState() + 1)

// Update without re-render
this.counter.setState(10, false)
```

#### `getPrevState()`
Returns the previous state value.

```javascript
const previousValue = this.counter.getPrevState()
```

### Examples

```javascript
class Counter extends PlainComponent {
    constructor() {
        super('counter-component')
        
        // Initialize states
        this.count = new PlainState(0, this)
        this.message = new PlainState('Hello', this)
        this.items = new PlainState([1, 2, 3], this)
        this.user = new PlainState({name: 'John', age: 30}, this)
    }
    
    template() {
        return `
            <div>
                <h1>Count: ${this.count.getState()}</h1>
                <p>Message: ${this.message.getState()}</p>
                <ul>
                    ${this.items.getState().map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p>User: ${this.user.getState().name} (${this.user.getState().age})</p>
            </div>
        `
    }
    
    increment() {
        this.count.setState(this.count.getState() + 1)
    }
    
    addItem(item) {
        const currentItems = this.items.getState()
        this.items.setState([...currentItems, item])
    }
    
    updateUser(updates) {
        const currentUser = this.user.getState()
        this.user.setState({...currentUser, ...updates})
    }
}
```

---

## PlainSignal

Event-based communication system between components.

### Constructor

```javascript
new PlainSignal(parent)
```

**Parameters:**
- `parent` (PlainComponent): Component that owns this signal instance

### Methods

#### `register(signal)`
Registers a signal that this component can emit.

```javascript
this.signals.register('user-login')
this.signals.register('data-loaded')
```

#### `emit(signal, args = null)`
Emits a signal with optional data.

**Parameters:**
- `signal` (string): Signal name
- `args` (any): Data to pass to listeners

```javascript
// Emit without data
this.signals.emit('user-logout')

// Emit with data
this.signals.emit('user-login', {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
})
```

#### `connect(emitter, signal, callback)`
Connects to a signal from another component.

**Parameters:**
- `emitter` (PlainComponent): Component that emits the signal
- `signal` (string): Signal name to listen for
- `callback` (function): Function to execute when signal is received

```javascript
// Connect to another component's signal
this.signals.connect(userComponent, 'user-login', this.handleLogin.bind(this))

// Connect with inline callback
this.signals.connect(dataComponent, 'data-loaded', (data) => {
    console.log('Data received:', data)
    this.processData(data)
})
```

### Signal Communication Example

```javascript
// Publisher component
class DataProvider extends PlainComponent {
    constructor() {
        super('data-provider')
        this.signals = new PlainSignal(this)
        
        // Register signals this component will emit
        this.signals.register('data-loaded')
        this.signals.register('data-error')
    }
    
    async loadData() {
        try {
            const data = await fetch('/api/data').then(r => r.json())
            this.signals.emit('data-loaded', data)
        } catch (error) {
            this.signals.emit('data-error', error.message)
        }
    }
}

// Subscriber component
class DataConsumer extends PlainComponent {
    constructor() {
        super('data-consumer')
        this.signals = new PlainSignal(this)
        this.data = new PlainState(null, this)
        this.error = new PlainState(null, this)
    }
    
    connectors() {
        const provider = document.querySelector('data-provider')
        
        this.signals.connect(provider, 'data-loaded', (data) => {
            this.data.setState(data)
            this.error.setState(null)
        })
        
        this.signals.connect(provider, 'data-error', (error) => {
            this.error.setState(error)
        })
    }
    
    template() {
        const data = this.data.getState()
        const error = this.error.getState()
        
        return `
            <div>
                ${error ? `<p class="error">${error}</p>` : ''}
                ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : '<p>No data</p>'}
            </div>
        `
    }
}
```

---

## PlainContext

Shared data storage between components with persistence options.

### Constructor

```javascript
new PlainContext(contextName, attachedComponent, subscribe = true, location = 'session')
```

**Parameters:**
- `contextName` (string): Unique name for the context
- `attachedComponent` (PlainComponent): Component using this context
- `subscribe` (boolean): Whether to subscribe to context changes
- `location` (string): Storage location ('session' or 'local')

### Methods

#### `setData(data, propagate = false)`
Sets data in the context.

**Parameters:**
- `data` (object): Data to store
- `propagate` (boolean): Whether to re-render subscribed components

```javascript
// Set data without propagation
this.userContext.setData({
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
})

// Set data with propagation
this.userContext.setData({
    theme: 'dark'
}, true)
```

#### `getData(key)`
Gets data from the context.

```javascript
const userId = this.userContext.getData('id')
const theme = this.appContext.getData('theme')
```

#### `clear()`
Clears all context data.

```javascript
this.userContext.clear()
```

#### `subscribe(component)`
Subscribes a component to context changes.

```javascript
this.userContext.subscribe(this)
```

### Context Example

```javascript
class UserProfile extends PlainComponent {
    constructor() {
        super('user-profile')
        
        // Create context with session storage
        this.userContext = new PlainContext('user', this, true, 'session')
        
        // Create context with local storage
        this.settingsContext = new PlainContext('settings', this, true, 'local')
    }
    
    template() {
        const name = this.userContext.getData('name') || 'Guest'
        const theme = this.settingsContext.getData('theme') || 'light'
        
        return `
            <div class="user-profile theme-${theme}">
                <h2>Welcome, ${name}</h2>
                <button class="logout-btn">Logout</button>
            </div>
        `
    }
    
    listeners() {
        this.$('.logout-btn').onclick = () => this.logout()
    }
    
    login(userData) {
        this.userContext.setData(userData, true)
    }
    
    logout() {
        this.userContext.clear()
    }
    
    changeTheme(theme) {
        this.settingsContext.setData({theme}, true)
    }
}
```

---

## PlainRouter

Simple URL-based routing system (Note: Currently basic implementation).

### Constructor

```javascript
new PlainRouter(root)
```

**Parameters:**
- `root` (string): Base URL for the application

### Methods

#### `parse()`
Parses the current URL and returns the route path.

```javascript
const router = new PlainRouter('https://myapp.com')
const currentPath = router.parse()
```

#### `route(routes)`
Matches current URL against route definitions.

**Parameters:**
- `routes` (object): Route definitions with path keys and handler values

```javascript
const router = new PlainRouter('https://myapp.com')

const routes = {
    '/': () => showHome(),
    '/about': () => showAbout(),
    '/contact': () => showContact(),
    '*': () => show404()
}

const handler = router.route(routes)
handler() // Execute matched route handler
```

### Router Example

```javascript
class AppRouter extends PlainComponent {
    constructor() {
        super('app-router')
        this.router = new PlainRouter(window.location.origin)
        this.currentView = new PlainState('home', this)
    }
    
    template() {
        const view = this.currentView.getState()
        return `
            <div class="app">
                <nav>
                    <a href="/" data-route>Home</a>
                    <a href="/about" data-route>About</a>
                    <a href="/contact" data-route>Contact</a>
                </nav>
                <main>
                    ${this.renderView(view)}
                </main>
            </div>
        `
    }
    
    elementConnected() {
        this.handleRoute()
        window.addEventListener('popstate', () => this.handleRoute())
    }
    
    handleRoute() {
        const routes = {
            '/': 'home',
            '/about': 'about',
            '/contact': 'contact',
            '*': '404'
        }
        
        const view = this.router.route(routes)
        this.currentView.setState(view)
    }
    
    renderView(view) {
        switch(view) {
            case 'home': return '<h1>Home Page</h1>'
            case 'about': return '<h1>About Page</h1>'
            case 'contact': return '<h1>Contact Page</h1>'
            default: return '<h1>404 - Page Not Found</h1>'
        }
    }
}
```

---

## PlainStyle

CSS management system with style encapsulation (Singleton pattern).

### Constructor

```javascript
new PlainStyle()
```

### Methods

#### `registerCSS(name, url)`
Registers CSS for a component.

**Parameters:**
- `name` (string): Component name
- `url` (string): Path to CSS file

```javascript
const style = new PlainStyle()
style.registerCSS('my-component', 'components/MyComponent/styles.css')
```

#### `renderCSS(name)`
Creates a style element with the registered CSS.

**Parameters:**
- `name` (string): Component name

```javascript
const styleElement = style.renderCSS('my-component')
```

#### `fetchCSS(url)`
Fetches CSS content from a URL (synchronous).

**Parameters:**
- `url` (string): Path to CSS file

```javascript
const cssContent = style.fetchCSS('path/to/styles.css')
```

### Style Example

```javascript
class StyledComponent extends PlainComponent {
    constructor() {
        super('styled-component', 'components/StyledComponent/styles.css')
        
        // PlainStyle is automatically used by PlainComponent
        // CSS is fetched and encapsulated in Shadow DOM
    }
    
    template() {
        return `
            <div class="container">
                <h1 class="title">Styled Component</h1>
                <p class="description">This component has encapsulated styles</p>
            </div>
        `
    }
}
```

---

## Complete Examples

### Todo Application

```javascript
// TodoApp.js
class TodoApp extends PlainComponent {
    constructor() {
        super('todo-app', 'components/TodoApp/TodoApp.css')
        
        this.todos = new PlainState([], this)
        this.filter = new PlainState('all', this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('todo-added')
        this.signals.register('todo-toggled')
        this.signals.register('todo-deleted')
    }
    
    template() {
        const todos = this.todos.getState()
        const filter = this.filter.getState()
        const filteredTodos = this.getFilteredTodos(todos, filter)
        
        return `
            <div class="todo-app">
                <h1>Todo Application</h1>
                
                <todo-form></todo-form>
                
                <div class="filters">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                    <button class="filter-btn ${filter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
                    <button class="filter-btn ${filter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
                </div>
                
                <div class="todo-list">
                    ${filteredTodos.map(todo => `
                        <todo-item 
                            data-id="${todo.id}" 
                            data-text="${todo.text}" 
                            data-completed="${todo.completed}">
                        </todo-item>
                    `).join('')}
                </div>
                
                <div class="stats">
                    <span>Total: ${todos.length}</span>
                    <span>Active: ${todos.filter(t => !t.completed).length}</span>
                    <span>Completed: ${todos.filter(t => t.completed).length}</span>
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$$('.filter-btn').forEach(btn => {
            btn.onclick = () => this.setFilter(btn.dataset.filter)
        })
    }
    
    connectors() {
        const todoForm = this.$('todo-form')
        const todoItems = this.$$('todo-item')
        
        this.signals.connect(todoForm, 'todo-added', (todo) => {
            this.addTodo(todo)
        })
        
        todoItems.forEach(item => {
            this.signals.connect(item, 'todo-toggled', (data) => {
                this.toggleTodo(data.id)
            })
            
            this.signals.connect(item, 'todo-deleted', (data) => {
                this.deleteTodo(data.id)
            })
        })
    }
    
    addTodo(todo) {
        const todos = this.todos.getState()
        this.todos.setState([...todos, {
            id: Date.now(),
            text: todo.text,
            completed: false
        }])
    }
    
    toggleTodo(id) {
        const todos = this.todos.getState()
        const updatedTodos = todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        )
        this.todos.setState(updatedTodos)
    }
    
    deleteTodo(id) {
        const todos = this.todos.getState()
        const filteredTodos = todos.filter(todo => todo.id !== id)
        this.todos.setState(filteredTodos)
    }
    
    setFilter(filter) {
        this.filter.setState(filter)
    }
    
    getFilteredTodos(todos, filter) {
        switch(filter) {
            case 'active':
                return todos.filter(todo => !todo.completed)
            case 'completed':
                return todos.filter(todo => todo.completed)
            default:
                return todos
        }
    }
}

customElements.define('todo-app', TodoApp)
```

---

## Best Practices

### 1. Component Organization

```javascript
// Good: Organized component structure
class UserCard extends PlainComponent {
    constructor() {
        super('user-card', 'components/UserCard/UserCard.css')
        
        // Initialize states
        this.user = new PlainState(null, this)
        this.loading = new PlainState(false, this)
        
        // Initialize signals
        this.signals = new PlainSignal(this)
        this.signals.register('user-selected')
    }
    
    // Template first
    template() { /* ... */ }
    
    // Then listeners
    listeners() { /* ... */ }
    
    // Then connectors
    connectors() { /* ... */ }
    
    // Finally, custom methods
    loadUser(id) { /* ... */ }
    selectUser() { /* ... */ }
}
```

### 2. State Management

```javascript
// Good: Proper state updates
updateUser(updates) {
    const currentUser = this.user.getState()
    this.user.setState({...currentUser, ...updates})
}

// Bad: Direct mutation
updateUserBad(updates) {
    const user = this.user.getState()
    user.name = updates.name // Don't mutate state directly
    this.user.setState(user)
}
```

### 3. Signal Communication

```javascript
// Good: Clear signal naming and data structure
class OrderForm extends PlainComponent {
    constructor() {
        super('order-form')
        this.signals = new PlainSignal(this)
        
        // Use descriptive signal names
        this.signals.register('order-submitted')
        this.signals.register('validation-failed')
    }
    
    submitOrder() {
        const orderData = this.getOrderData()
        
        if (this.validateOrder(orderData)) {
            this.signals.emit('order-submitted', {
                order: orderData,
                timestamp: Date.now(),
                source: 'order-form'
            })
        } else {
            this.signals.emit('validation-failed', {
                errors: this.getValidationErrors()
            })
        }
    }
}
```

### 4. Context Usage

```javascript
// Good: Meaningful context names and data structure
class ShoppingCart extends PlainComponent {
    constructor() {
        super('shopping-cart')
        
        // Use descriptive context names
        this.cartContext = new PlainContext('shoppingCart', this, true, 'session')
        this.userContext = new PlainContext('user', this, true, 'local')
    }
    
    addToCart(product) {
        const cart = this.cartContext.getData('items') || []
        const updatedCart = [...cart, product]
        
        this.cartContext.setData({
            items: updatedCart,
            total: this.calculateTotal(updatedCart),
            lastUpdated: Date.now()
        }, true) // Propagate to update other cart components
    }
}
```

### 5. Error Handling

```javascript
class DataComponent extends PlainComponent {
    constructor() {
        super('data-component')
        this.data = new PlainState(null, this)
        this.error = new PlainState(null, this)
        this.loading = new PlainState(false, this)
    }
    
    async loadData() {
        try {
            this.loading.setState(true)
            this.error.setState(null)
            
            const data = await fetch('/api/data').then(r => r.json())
            this.data.setState(data)
            
        } catch (error) {
            this.error.setState(error.message)
            console.error('Data loading failed:', error)
            
        } finally {
            this.loading.setState(false)
        }
    }
    
    template() {
        const loading = this.loading.getState()
        const error = this.error.getState()
        const data = this.data.getState()
        
        if (loading) return '<div class="loading">Loading...</div>'
        if (error) return `<div class="error">Error: ${error}</div>`
        if (!data) return '<div class="empty">No data</div>'
        
        return `<div class="data">${JSON.stringify(data)}</div>`
    }
}
```

---

## TypeScript Support

While Plain Reactive is written in JavaScript, you can use it with TypeScript:

```typescript
interface UserData {
    id: number
    name: string
    email: string
}

class TypedComponent extends PlainComponent {
    private userData: PlainState<UserData | null>
    
    constructor() {
        super('typed-component')
        this.userData = new PlainState<UserData | null>(null, this)
    }
    
    setUser(user: UserData): void {
        this.userData.setState(user)
    }
    
    template(): string {
        const user = this.userData.getState()
        return `
            <div>
                ${user ? `<h1>Hello, ${user.name}</h1>` : '<h1>No user</h1>'}
            </div>
        `
    }
}
```

---

This comprehensive API reference covers all public APIs, methods, and usage patterns for the Plain Reactive library. For more detailed examples and tutorials, refer to the individual documentation files in the `docs/` directory.