# Plain - Documentation

Plain is a vanilla JavaScript library that provides tools to easily and quickly build reusable reactive web components, without having to learn complex frameworks or new syntax.

## 📜 Licensing

Plain is licensed under the **MIT License** - free for all uses including commercial applications.

[📋 See usage guidelines](../TERMS.md)

## Index

### Getting Started
- [Installation and Setup](./installation.md)
- [Complete API Reference](./api-reference.md) 📚
- [Quick Reference Card](./quick-reference.md) ⚡
- [Examples Collection](./examples-collection.md) 🎯

### Core Modules
- [Components](./components.md)
- [State](./state.md)
- [Signals](./signals.md)
- [Context](./context.md)
- [Routing](./router.md)
- [Styles](./styles.md)

### Additional Resources
- [Usage Guidelines](../TERMS.md)

## Main Features

- **No dependencies** - Lightweight library based on vanilla JavaScript
- **Web Components** - Uses modern web standards
- **Style encapsulation** - Shadow DOM to isolate styles
- **Reactive system** - Automatic rendering when state changes
- **Component communication** - Signal system for communication
- **Shared storage** - Context system for sharing data
- **Simple routing** - URL-based routing for SPA applications

## Design Philosophy

Plain has been designed with the following principles:

1. **Simplicity** - Intuitive and easy-to-learn API
2. **Flexibility** - Works with any project structure
3. **Modularity** - Use only what you need
4. **Web standards** - Based on standard web technologies
5. **Performance** - Lightweight and fast

## Quick Example

```javascript
import { PlainComponent, PlainState } from 'plain-reactive'

class Counter extends PlainComponent {
    constructor() {
        super('counter', 'components/Counter/Counter.css')
        
        // State
        this.counter = new PlainState(0, this)
    }
    
    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="counter">
                <h2>Counter: ${this.counter.getState()}</h2>
                <div class="buttons">
                    <button class="decrement">-</button>
                    <button class="increment">+</button>
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$('.increment').onclick = () => this.increment()
        this.$('.decrement').onclick = () => this.decrement()
    }
    
    increment() {
        this.counter.setState(this.counter.getState() + 1)
    }
    
    decrement() {
        this.counter.setState(this.counter.getState() - 1)
    }
}

export default customElements.define('my-counter', Counter)
```

Use it in HTML:

```html
<my-counter></my-counter>
```

## License

Plain is distributed under the [MIT License](https://opensource.org/licenses/MIT).

### What this means:

- ✅ **Free for**: Personal projects, education, open source projects, commercial applications
- ✅ **No restrictions**: Keep your application source code private
- ✅ **Commercial friendly**: Use in products you sell
- 🤝 **Community guidelines**: We encourage responsible use ([see terms](../TERMS.md))

---

Need more help? Check the specific documentation sections for detailed information about each module. 