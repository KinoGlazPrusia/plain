# Plain Reactive - Examples Collection

> Practical real-world examples for common use cases

## Table of Contents
1. [Basic Counter](#basic-counter)
2. [Todo List](#todo-list)
3. [User Authentication](#user-authentication)
4. [Data Fetching](#data-fetching)
5. [Form Handling](#form-handling)
6. [Theme Switcher](#theme-switcher)
7. [Shopping Cart](#shopping-cart)
8. [Real-time Chat](#real-time-chat)

---

## Basic Counter

Simple counter with increment/decrement functionality.

```javascript
// Counter.js
import { PlainComponent, PlainState } from 'plain-reactive'

class Counter extends PlainComponent {
    constructor() {
        super('counter-component', 'components/Counter/Counter.css')
        this.count = new PlainState(0, this)
    }
    
    template() {
        return `
            <div class="counter">
                <h2>Count: ${this.count.getState()}</h2>
                <div class="controls">
                    <button class="decrement">-</button>
                    <button class="increment">+</button>
                    <button class="reset">Reset</button>
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$('.increment').onclick = () => this.increment()
        this.$('.decrement').onclick = () => this.decrement()
        this.$('.reset').onclick = () => this.reset()
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
}

export default customElements.define('counter-component', Counter)
```

**Usage:**
```html
<counter-component></counter-component>
```

---

## Todo List

Complete todo application with add, toggle, and delete functionality.

```javascript
// TodoApp.js
import { PlainComponent, PlainState, PlainSignal } from 'plain-reactive'

class TodoApp extends PlainComponent {
    constructor() {
        super('todo-app', 'components/TodoApp/TodoApp.css')
        
        this.todos = new PlainState([], this)
        this.newTodoText = new PlainState('', this)
        this.filter = new PlainState('all', this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('todo-added')
        this.signals.register('todo-removed')
    }
    
    template() {
        const todos = this.todos.getState()
        const filter = this.filter.getState()
        const filteredTodos = this.getFilteredTodos(todos, filter)
        
        return `
            <div class="todo-app">
                <h1>Todo List</h1>
                
                <div class="add-todo">
                    <input 
                        type="text" 
                        class="new-todo" 
                        placeholder="Add new todo..." 
                        value="${this.newTodoText.getState()}"
                    >
                    <button class="add-btn">Add</button>
                </div>
                
                <div class="filters">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                    <button class="filter-btn ${filter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
                    <button class="filter-btn ${filter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
                </div>
                
                <div class="todo-list">
                    ${filteredTodos.map(todo => `
                        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                            <span class="todo-text">${todo.text}</span>
                            <button class="delete-btn">Delete</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="stats">
                    <span>Total: ${todos.length}</span>
                    <span>Active: ${todos.filter(t => !t.completed).length}</span>
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$('.add-btn').onclick = () => this.addTodo()
        this.$('.new-todo').onkeypress = (e) => {
            if (e.key === 'Enter') this.addTodo()
        }
        this.$('.new-todo').oninput = (e) => this.newTodoText.setState(e.target.value)
        
        this.$$('.filter-btn').forEach(btn => {
            btn.onclick = () => this.setFilter(btn.dataset.filter)
        })
        
        this.$$('.todo-item').forEach(item => {
            const checkbox = item.querySelector('input')
            const deleteBtn = item.querySelector('.delete-btn')
            
            checkbox.onchange = () => this.toggleTodo(parseInt(item.dataset.id))
            deleteBtn.onclick = () => this.deleteTodo(parseInt(item.dataset.id))
        })
    }
    
    addTodo() {
        const text = this.newTodoText.getState().trim()
        if (!text) return
        
        const todos = this.todos.getState()
        const newTodo = {
            id: Date.now(),
            text,
            completed: false
        }
        
        this.todos.setState([...todos, newTodo])
        this.newTodoText.setState('')
        this.signals.emit('todo-added', newTodo)
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
        this.signals.emit('todo-removed', id)
    }
    
    setFilter(filter) {
        this.filter.setState(filter)
    }
    
    getFilteredTodos(todos, filter) {
        switch(filter) {
            case 'active': return todos.filter(todo => !todo.completed)
            case 'completed': return todos.filter(todo => todo.completed)
            default: return todos
        }
    }
}

export default customElements.define('todo-app', TodoApp)
```

---

## User Authentication

Authentication component with login/logout functionality using context.

```javascript
// AuthManager.js
import { PlainComponent, PlainContext, PlainState, PlainSignal } from 'plain-reactive'

class AuthManager extends PlainComponent {
    constructor() {
        super('auth-manager', 'components/AuthManager/AuthManager.css')
        
        this.userContext = new PlainContext('user', this, true, 'local')
        this.loginForm = new PlainState({email: '', password: ''}, this)
        this.loading = new PlainState(false, this)
        this.error = new PlainState(null, this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('user-logged-in')
        this.signals.register('user-logged-out')
    }
    
    template() {
        const user = this.userContext.getData('user')
        const form = this.loginForm.getState()
        const loading = this.loading.getState()
        const error = this.error.getState()
        
        if (user) {
            return `
                <div class="auth-manager logged-in">
                    <div class="user-info">
                        <h3>Welcome, ${user.name}!</h3>
                        <p>Email: ${user.email}</p>
                        <button class="logout-btn">Logout</button>
                    </div>
                </div>
            `
        }
        
        return `
            <div class="auth-manager login-form">
                <h2>Login</h2>
                ${error ? `<div class="error">${error}</div>` : ''}
                <form>
                    <input 
                        type="email" 
                        class="email-input" 
                        placeholder="Email" 
                        value="${form.email}"
                        ${loading ? 'disabled' : ''}
                    >
                    <input 
                        type="password" 
                        class="password-input" 
                        placeholder="Password" 
                        value="${form.password}"
                        ${loading ? 'disabled' : ''}
                    >
                    <button 
                        type="submit" 
                        class="login-btn"
                        ${loading ? 'disabled' : ''}
                    >
                        ${loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        `
    }
    
    listeners() {
        const user = this.userContext.getData('user')
        
        if (user) {
            this.$('.logout-btn').onclick = () => this.logout()
        } else {
            this.$('.email-input').oninput = (e) => this.updateForm({email: e.target.value})
            this.$('.password-input').oninput = (e) => this.updateForm({password: e.target.value})
            this.$('form').onsubmit = (e) => {
                e.preventDefault()
                this.login()
            }
        }
    }
    
    updateForm(updates) {
        const form = this.loginForm.getState()
        this.loginForm.setState({...form, ...updates})
    }
    
    async login() {
        const form = this.loginForm.getState()
        
        if (!form.email || !form.password) {
            this.error.setState('Please fill in all fields')
            return
        }
        
        this.loading.setState(true)
        this.error.setState(null)
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const user = {
                id: 1,
                name: 'John Doe',
                email: form.email
            }
            
            this.userContext.setData({user}, true)
            this.signals.emit('user-logged-in', user)
            
        } catch (error) {
            this.error.setState('Login failed. Please try again.')
        } finally {
            this.loading.setState(false)
        }
    }
    
    logout() {
        this.userContext.clear()
        this.loginForm.setState({email: '', password: ''})
        this.signals.emit('user-logged-out')
    }
}

export default customElements.define('auth-manager', AuthManager)
```

---

## Data Fetching

Component that fetches and displays data with loading states.

```javascript
// DataFetcher.js
import { PlainComponent, PlainState, PlainSignal } from 'plain-reactive'

class DataFetcher extends PlainComponent {
    constructor() {
        super('data-fetcher', 'components/DataFetcher/DataFetcher.css')
        
        this.data = new PlainState(null, this)
        this.loading = new PlainState(false, this)
        this.error = new PlainState(null, this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('data-loaded')
        this.signals.register('data-error')
    }
    
    template() {
        const data = this.data.getState()
        const loading = this.loading.getState()
        const error = this.error.getState()
        
        return `
            <div class="data-fetcher">
                <h2>Data Fetcher</h2>
                <div class="controls">
                    <button class="fetch-btn" ${loading ? 'disabled' : ''}>
                        ${loading ? 'Loading...' : 'Fetch Data'}
                    </button>
                    <button class="clear-btn">Clear</button>
                </div>
                
                <div class="content">
                    ${error ? `<div class="error">Error: ${error}</div>` : ''}
                    ${loading ? '<div class="loading">Loading data...</div>' : ''}
                    ${data ? `
                        <div class="data">
                            <h3>Fetched Data:</h3>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    ` : ''}
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$('.fetch-btn').onclick = () => this.fetchData()
        this.$('.clear-btn').onclick = () => this.clearData()
    }
    
    async fetchData() {
        this.loading.setState(true)
        this.error.setState(null)
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const response = {
                id: Math.floor(Math.random() * 1000),
                title: 'Sample Data',
                description: 'This is fetched data',
                timestamp: new Date().toISOString()
            }
            
            this.data.setState(response)
            this.signals.emit('data-loaded', response)
            
        } catch (error) {
            this.error.setState(error.message)
            this.signals.emit('data-error', error)
        } finally {
            this.loading.setState(false)
        }
    }
    
    clearData() {
        this.data.setState(null)
        this.error.setState(null)
    }
}

export default customElements.define('data-fetcher', DataFetcher)
```

---

## Form Handling

Advanced form with validation and submission.

```javascript
// ContactForm.js
import { PlainComponent, PlainState, PlainSignal } from 'plain-reactive'

class ContactForm extends PlainComponent {
    constructor() {
        super('contact-form', 'components/ContactForm/ContactForm.css')
        
        this.formData = new PlainState({
            name: '',
            email: '',
            message: ''
        }, this)
        this.errors = new PlainState({}, this)
        this.submitting = new PlainState(false, this)
        this.submitted = new PlainState(false, this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('form-submitted')
    }
    
    template() {
        const form = this.formData.getState()
        const errors = this.errors.getState()
        const submitting = this.submitting.getState()
        const submitted = this.submitted.getState()
        
        if (submitted) {
            return `
                <div class="contact-form success">
                    <h2>Thank You!</h2>
                    <p>Your message has been sent successfully.</p>
                    <button class="reset-btn">Send Another Message</button>
                </div>
            `
        }
        
        return `
            <div class="contact-form">
                <h2>Contact Us</h2>
                <form>
                    <div class="field">
                        <label for="name">Name:</label>
                        <input 
                            type="text" 
                            id="name" 
                            value="${form.name}" 
                            ${submitting ? 'disabled' : ''}
                        >
                        ${errors.name ? `<span class="error">${errors.name}</span>` : ''}
                    </div>
                    
                    <div class="field">
                        <label for="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            value="${form.email}" 
                            ${submitting ? 'disabled' : ''}
                        >
                        ${errors.email ? `<span class="error">${errors.email}</span>` : ''}
                    </div>
                    
                    <div class="field">
                        <label for="message">Message:</label>
                        <textarea 
                            id="message" 
                            rows="5" 
                            ${submitting ? 'disabled' : ''}
                        >${form.message}</textarea>
                        ${errors.message ? `<span class="error">${errors.message}</span>` : ''}
                    </div>
                    
                    <button 
                        type="submit" 
                        class="submit-btn" 
                        ${submitting ? 'disabled' : ''}
                    >
                        ${submitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        `
    }
    
    listeners() {
        if (this.submitted.getState()) {
            this.$('.reset-btn').onclick = () => this.resetForm()
        } else {
            this.$('#name').oninput = (e) => this.updateField('name', e.target.value)
            this.$('#email').oninput = (e) => this.updateField('email', e.target.value)
            this.$('#message').oninput = (e) => this.updateField('message', e.target.value)
            this.$('form').onsubmit = (e) => {
                e.preventDefault()
                this.submitForm()
            }
        }
    }
    
    updateField(field, value) {
        const form = this.formData.getState()
        this.formData.setState({...form, [field]: value})
        
        // Clear error when user starts typing
        const errors = this.errors.getState()
        if (errors[field]) {
            this.errors.setState({...errors, [field]: null})
        }
    }
    
    validateForm() {
        const form = this.formData.getState()
        const errors = {}
        
        if (!form.name.trim()) errors.name = 'Name is required'
        if (!form.email.trim()) errors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format'
        if (!form.message.trim()) errors.message = 'Message is required'
        
        this.errors.setState(errors)
        return Object.keys(errors).length === 0
    }
    
    async submitForm() {
        if (!this.validateForm()) return
        
        this.submitting.setState(true)
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            this.submitted.setState(true)
            this.signals.emit('form-submitted', this.formData.getState())
            
        } catch (error) {
            this.errors.setState({submit: 'Failed to send message. Please try again.'})
        } finally {
            this.submitting.setState(false)
        }
    }
    
    resetForm() {
        this.formData.setState({name: '', email: '', message: ''})
        this.errors.setState({})
        this.submitted.setState(false)
        this.submitting.setState(false)
    }
}

export default customElements.define('contact-form', ContactForm)
```

---

## Theme Switcher

Theme management using context and signals.

```javascript
// ThemeSwitcher.js
import { PlainComponent, PlainContext, PlainSignal, PlainState } from 'plain-reactive'

class ThemeSwitcher extends PlainComponent {
    constructor() {
        super('theme-switcher', 'components/ThemeSwitcher/ThemeSwitcher.css')
        
        this.themeContext = new PlainContext('theme', this, true, 'local')
        this.currentTheme = new PlainState(this.themeContext.getData('current') || 'light', this)
        this.signals = new PlainSignal(this)
        
        this.signals.register('theme-changed')
        
        // Initialize theme
        this.applyTheme(this.currentTheme.getState())
    }
    
    template() {
        const theme = this.currentTheme.getState()
        const themes = ['light', 'dark', 'blue', 'green']
        
        return `
            <div class="theme-switcher">
                <h3>Theme: ${theme}</h3>
                <div class="theme-options">
                    ${themes.map(t => `
                        <button 
                            class="theme-btn ${t === theme ? 'active' : ''}" 
                            data-theme="${t}"
                        >
                            ${t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    `).join('')}
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$$('.theme-btn').forEach(btn => {
            btn.onclick = () => this.changeTheme(btn.dataset.theme)
        })
    }
    
    changeTheme(theme) {
        this.currentTheme.setState(theme)
        this.themeContext.setData({current: theme}, true)
        this.applyTheme(theme)
        this.signals.emit('theme-changed', theme)
    }
    
    applyTheme(theme) {
        document.body.className = `theme-${theme}`
    }
}

export default customElements.define('theme-switcher', ThemeSwitcher)
```

---

## Usage Instructions

### HTML Setup
```html
<!DOCTYPE html>
<html>
<head>
    <title>Plain Reactive Examples</title>
    <style>
        /* Base theme styles */
        .theme-light { --bg: #fff; --text: #333; }
        .theme-dark { --bg: #333; --text: #fff; }
        .theme-blue { --bg: #e3f2fd; --text: #1565c0; }
        .theme-green { --bg: #e8f5e8; --text: #2e7d32; }
    </style>
</head>
<body>
    <h1>Plain Reactive Examples</h1>
    
    <!-- Use any component -->
    <counter-component></counter-component>
    <todo-app></todo-app>
    <auth-manager></auth-manager>
    <data-fetcher></data-fetcher>
    <contact-form></contact-form>
    <theme-switcher></theme-switcher>
    
    <script type="module" src="./main.js"></script>
</body>
</html>
```

### JavaScript Setup
```javascript
// main.js
import './components/Counter.js'
import './components/TodoApp.js'
import './components/AuthManager.js'
import './components/DataFetcher.js'
import './components/ContactForm.js'
import './components/ThemeSwitcher.js'

// Components are automatically registered and ready to use
```

---

These examples demonstrate the key features of Plain Reactive:
- **State Management**: Reactive updates with PlainState
- **Component Communication**: Signal-based messaging
- **Data Persistence**: Context with localStorage/sessionStorage
- **Lifecycle Management**: Proper setup and cleanup
- **Error Handling**: Loading states and error boundaries
- **Form Handling**: Validation and submission
- **Theme Management**: Dynamic styling with context

Each example is self-contained and can be used as a starting point for your own applications.