# Signals

The PlainSignal system allows components to communicate with each other without direct dependencies.

## Basic Functionality

Signals in Plain provide a way for components to communicate with each other through an event-based system. This approach:

- Decouples components from each other
- Facilitates communication between unrelated components
- Allows for custom event handling throughout the application

## Usage

### Initialization

Signals are accessed through a singleton instance, so there's no need to create a new instance:

```javascript
import { PlainComponent, PlainSignal } from 'plain-reactive'

class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/MyComponent.css')
        
        // Access the signal system
        this.signals = PlainSignal
    }
    
    // ...
}
```

### Registering Signals

Before a component can emit signals, it **must** register them first. This is a required step before emitting any signal:

```javascript
constructor() {
    super('my-component', 'path/to/MyComponent.css')
    this.signals = PlainSignal
    
    // Register signals this component will emit
    this.signals.register('item-selected')
    this.signals.register('data-loaded')
    this.signals.register('form-submitted')
}
```

The `register()` method takes one parameter:
- `signalName`: String identifying the signal that this component will emit

You can only emit signals that have been previously registered in the component. This ensures proper signal management and prevents accidental emissions of undocumented signals.

### Emitting Signals

To emit a signal (send a message to all listeners), use the `emit()` method:

```javascript
sendMessage() {
    // Emit a signal with a name and optional data
    this.signals.emit('message-sent', {
        text: 'Hello from MyComponent',
        timestamp: Date.now()
    })
}

updateUser(user) {
    this.signals.emit('user-updated', user)
}

notifyError(error) {
    this.signals.emit('app-error', {
        message: error.message,
        code: error.code
    })
}
```

The `emit()` method takes two parameters:
- `signalName`: String identifying the signal (must have been registered first)
- `data`: Any data you want to pass to the receivers (optional)

### Connecting to Signals

To listen for signals, use the `connect()` method:

```javascript
import { PlainComponent, PlainSignal } from 'plain-reactive'

class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/MyComponent.css')
        this.signals = PlainSignal
    }
    
    // Other methods...
    
    // This method is called after the component is rendered
    connectors() {
        // Connect to signals
        this.signals.connect('message-sent', this.handleMessage.bind(this))
        this.signals.connect('user-updated', this.refreshUserData.bind(this))
        
        // You can also define inline handlers
        this.signals.connect('app-error', (error) => {
            console.error('An error occurred:', error.message)
            this.showErrorNotification(error)
        })
    }
    
    handleMessage(data) {
        console.log(`Received message: ${data.text} at ${new Date(data.timestamp)}`)
        // Process the message
    }
    
    refreshUserData(user) {
        // Update component with new user data
        console.log('User data updated:', user)
        this.render()
    }
}
```

The `connect()` method takes two parameters:
- `signalName`: String identifying the signal to listen for
- `callback`: Function to execute when the signal is received

### Using the connectors() Method

PlainComponent provides a special lifecycle method called `connectors()` that's specifically designed for setting up signal connections. This is the recommended place to establish connections between components:

```javascript
class AppComponent extends PlainComponent {
    constructor() {
        super('app-component', 'components/App/App.css')
        this.signals = PlainSignal
    }
    
    // This method is called after the component is rendered
    connectors() {
        // Get references to other components
        const userForm = document.querySelector('user-form')
        const userProfile = document.querySelector('user-profile')
        const notifications = document.querySelector('notification-center')
        
        // Connect signals between components
        userForm.signals.connect('user-login', userProfile.updateUserData.bind(userProfile))
        userForm.signals.connect('user-login', notifications.showLoginMessage.bind(notifications))
        userProfile.signals.connect('profile-updated', notifications.showUpdateMessage.bind(notifications))
    }
    
    // Other methods...
}
```

Using the `connectors()` method in your top-level components provides several benefits:
1. It keeps signal connections organized in one place
2. It follows the component lifecycle (connections are made after rendering)
3. It makes the communication flow between components explicit and easy to understand

### Disconnecting from Signals

When you no longer need to listen for a signal, you can disconnect using the `disconnect()` method:

```javascript
disconnect() {
    // Disconnect a specific handler from a specific signal
    this.signals.disconnect('message-sent', this.handleMessage)
    
    // You can also disconnect all handlers for a specific signal
    this.signals.disconnect('user-updated')
}
```

## Complete Example

Here's a complete example showing communication between a sender and receiver component:

```javascript
// MessageSender.js
import { PlainComponent, PlainSignal, PlainState } from 'plain-reactive'

class MessageSender extends PlainComponent {
    constructor() {
        super('message-sender', 'components/MessageSender/MessageSender.css')
        this.signals = PlainSignal
        this.message = new PlainState('', this)
        
        // Register the signal this component will emit
        this.signals.register('new-message')
    }

    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="sender">
                <h2>Send a Message</h2>
                <input 
                    type="text" 
                    placeholder="Type your message" 
                    value="${this.message.getState()}"
                />
                <button class="send-btn">Send</button>
            </div>
        `
    }

    listeners() {
        this.$('input').oninput = (e) => {
            this.message.setState(e.target.value)
        }
        
        this.$('.send-btn').onclick = () => {
            const text = this.message.getState().trim()
            if (text) {
                // Emit signal with message data
                this.signals.emit('new-message', {
                    text,
                    sender: 'User',
                    timestamp: Date.now()
                })
                
                // Clear input
                this.message.setState('')
            }
        }
    }
}

export default customElements.define('message-sender', MessageSender)
```

```javascript
// MessageReceiver.js
import { PlainComponent, PlainSignal, PlainState } from 'plain-reactive'

class MessageReceiver extends PlainComponent {
    constructor() {
        super('message-receiver', 'components/MessageReceiver/MessageReceiver.css')
        this.signals = PlainSignal
        this.messages = new PlainState([], this)
    }
    
    // No signal registration needed here as this component only receives signals

    template() {
        const messages = this.messages.getState()
        
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="receiver">
                <h2>Messages</h2>
                <div class="message-list">
                    ${messages.length === 0 
                        ? '<p class="empty">No messages yet</p>' 
                        : messages.map(msg => `
                            <div class="message">
                                <div class="message-header">
                                    <span class="sender">${msg.sender}</span>
                                    <span class="time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p class="text">${msg.text}</p>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `
    }
    
    handleNewMessage(data) {
        const currentMessages = this.messages.getState()
        this.messages.setState([...currentMessages, data])
    }
}

export default customElements.define('message-receiver', MessageReceiver)
```

```javascript
// App.js
import { PlainComponent, PlainSignal } from 'plain-reactive'
import './MessageSender.js'
import './MessageReceiver.js'

class MessagingApp extends PlainComponent {
    constructor() {
        super('messaging-app', 'components/MessagingApp/MessagingApp.css')
        this.signals = PlainSignal
    }

    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="messaging-app">
                <h1>Messaging Application</h1>
                <div class="container">
                    <message-sender></message-sender>
                    <message-receiver></message-receiver>
                </div>
            </div>
        `
    }
    
    // Setup signal connections between components
    connectors() {
        const sender = this.$('message-sender')
        const receiver = this.$('message-receiver')
        
        // Connect the sender's signal to the receiver's handler
        sender.signals.connect('new-message', receiver.handleNewMessage.bind(receiver))
    }
}

export default customElements.define('messaging-app', MessagingApp)
```

Use it in HTML:

```html
<messaging-app></messaging-app>
```

---

[Back to README](./README.md) 