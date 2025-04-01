# Context

PlainContext provides a mechanism for sharing data between components, similar to React's Context.

## Sharing Data Between Components

The context system in Plain allows you to create multiple context instances that can be used to share data between components. This is useful for:

- Storing application-wide data
- Sharing data between unrelated components
- Avoiding "prop drilling" through multiple component levels

## Usage

### Initialization

While PlainContext uses a singleton pattern internally, you need to create separate context instances with different names:

```javascript
import { PlainComponent, PlainContext } from 'plain-reactive'

class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/MyComponent.css')
        
        // Create context instances with unique names
        this.userContext = new PlainContext('user', this)
        this.appContext = new PlainContext('app', this)
        this.themeContext = new PlainContext('theme', this)
    }
    
    // ...
}
```

The PlainContext constructor takes the following parameters:
- `contextName` (required): String identifying the context
- `component` (required): Reference to the component using the context
- `options` (optional): Additional options like storage type ('local' or 'session')

### Storing Data in Context

To store data in the context, use the `setData()` method:

```javascript
// Store data in user context
this.userContext.setData({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
})

// Store data in app context
this.appContext.setData({
    theme: 'dark',
    language: 'en',
    notifications: true
})

// Store primitive values
this.themeContext.setData({
    current: 'dark',
    lastChanged: Date.now()
})
```

### Accessing Data from Context

To retrieve data from the context, use the `getData()` method:

```javascript
// Get user data
const userName = this.userContext.getData('name')
console.log(`Current user: ${userName}`)

// Get settings
const theme = this.appContext.getData('theme')
applyTheme(theme)

// Check if user is logged in
if (this.userContext.getData('id')) {
    showUserDashboard()
}
```

### Clearing Context Data

To remove data from the context, use the `clear()` method:

```javascript
// Clear a specific context entirely
this.userContext.clear()

// You can also clear just specific keys
// this.userContext.clear('name', 'email')
```

### Propagating Changes

When context data changes, you can notify other components by setting the propagate parameter to true:

```javascript
updateTheme(newTheme) {
    // Update context with propagation enabled
    this.appContext.setData({
        theme: newTheme
    }, true) // true enables propagation
    
    // Components that use this context and are set to subscribe will automatically re-render
}
```

## Complete Example

Here's a complete example of using context to manage a theme across components:

```javascript
// ThemeProvider.js
import { PlainComponent, PlainContext, PlainSignal } from 'plain-reactive'

class ThemeProvider extends PlainComponent {
    constructor() {
        super('theme-provider')
        this.themeContext = new PlainContext('theme', this)
        this.signals = PlainSignal
        
        // Initialize theme in context if it doesn't exist
        if (!this.themeContext.getData('current')) {
            this.themeContext.setData({
                current: 'light'
            })
        }
    }
    
    template() {
        // This component doesn't render anything visible
        // Use lit-html extension for HTML syntax highlighting
        return html`<div style="display: none;"></div>`
    }
    
    connectors() {
        // Listen for theme change requests
        this.signals.connect('theme-change', this.handleThemeChange.bind(this))
    }
    
    handleThemeChange(newTheme) {
        // Update theme in context with propagation enabled
        this.themeContext.setData({
            current: newTheme,
            lastChanged: Date.now()
        }, true)
        
        // Emit signal to notify components that theme has changed
        this.signals.emit('theme-updated', newTheme)
        
        // Update body class for global styles
        document.body.className = `theme-${newTheme}`
    }
}

export default customElements.define('theme-provider', ThemeProvider)
```

```javascript
// ThemeSwitcher.js
import { PlainComponent, PlainContext, PlainSignal, PlainState } from 'plain-reactive'

class ThemeSwitcher extends PlainComponent {
    constructor() {
        super('theme-switcher', 'components/ThemeSwitcher/ThemeSwitcher.css')
        this.themeContext = new PlainContext('theme', this, true) // true enables subscription to changes
        this.signals = PlainSignal
        
        // Local state for current theme
        this.currentTheme = new PlainState(
            this.themeContext.getData('current') || 'light',
            this
        )
    }
    
    template() {
        const theme = this.currentTheme.getState()
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="theme-switcher">
                <span>Current theme: ${theme}</span>
                <button class="toggle-btn">
                    Switch to ${theme === 'dark' ? 'light' : 'dark'} theme
                </button>
            </div>
        `
    }
    
    listeners() {
        this.$('.toggle-btn').onclick = () => this.toggleTheme()
    }
    
    connectors() {
        // Listen for theme updates from other components
        this.signals.connect('theme-updated', this.handleThemeUpdate.bind(this))
    }
    
    handleThemeUpdate(theme) {
        // Update local state to reflect context changes
        this.currentTheme.setState(theme)
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme.getState() === 'dark' ? 'light' : 'dark'
        // Request theme change via signal
        this.signals.emit('theme-change', newTheme)
    }
}

export default customElements.define('theme-switcher', ThemeSwitcher)
```

```javascript
// ThemedContent.js
import { PlainComponent, PlainContext, PlainSignal, PlainState } from 'plain-reactive'

class ThemedContent extends PlainComponent {
    constructor() {
        super('themed-content', 'components/ThemedContent/ThemedContent.css')
        this.themeContext = new PlainContext('theme', this, true) // true enables subscription to changes
        this.signals = PlainSignal
        
        // Local state for current theme
        this.currentTheme = new PlainState(
            this.themeContext.getData('current') || 'light',
            this
        )
    }
    
    template() {
        const theme = this.currentTheme.getState()
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="themed-content theme-${theme}">
                <h2>Themed Content</h2>
                <p>This content automatically adapts to the current theme: ${theme}</p>
                <p>The styling of this component changes based on the shared context.</p>
            </div>
        `
    }
    
    connectors() {
        // Listen for theme updates
        this.signals.connect('theme-updated', this.handleThemeUpdate.bind(this))
    }
    
    handleThemeUpdate(theme) {
        this.currentTheme.setState(theme)
    }
}

export default customElements.define('themed-content', ThemedContent)
```

Use it in HTML:

```html
<theme-provider></theme-provider>
<theme-switcher></theme-switcher>
<themed-content></themed-content>
```

---

[Back to README](./README.md) 