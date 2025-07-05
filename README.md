# Plain Reactive Framework

> A vanilla JavaScript library for building reusable reactive web components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/plain-reactive.svg)](https://npmjs.org/package/plain-reactive)

Plain is a lightweight, dependency-free JavaScript library that provides tools to easily build reactive web components using modern web standards like Custom Elements and Shadow DOM.

## ✨ Features

- **No dependencies** - Pure vanilla JavaScript
- **Web Components** - Built on web standards
- **Reactive system** - Automatic re-rendering
- **Style encapsulation** - Shadow DOM isolation
- **Component communication** - Signal-based events
- **Shared state** - Context system
- **Simple routing** - URL-based navigation
- **MIT Licensed** - Free for all uses

## 🚀 Quick Start

```bash
npm install plain-reactive
```

```javascript
import { PlainComponent, PlainState } from 'plain-reactive'

class Counter extends PlainComponent {
    constructor() {
        super('counter', './Counter.css')
        this.count = new PlainState(0, this)
    }
    
    template() {
        return `
            <div class="counter">
                <h2>Count: ${this.count.getState()}</h2>
                <button class="increment">+</button>
                <button class="decrement">-</button>
            </div>
        `
    }
    
    listeners() {
        this.$('.increment').onclick = () => this.count.setState(this.count.getState() + 1)
        this.$('.decrement').onclick = () => this.count.setState(this.count.getState() - 1)
    }
}

customElements.define('my-counter', Counter)
```

## 📚 Documentation

Complete documentation is available in the `docs/` directory:

- [Getting Started](./docs/README.md)
- [Components](./docs/components.md)
- [State Management](./docs/state.md)
- [Signals](./docs/signals.md)
- [Context](./docs/context.md)
- [Routing](./docs/router.md)
- [Styles](./docs/styles.md)

## 🛠️ Development Tools

### Create New Components
```bash
npm run create src ComponentName
```

### Initialize New Project
```bash
npm run init
```

## 🎯 Use Cases

Perfect for:
- 🏗️ Building modern web applications
- 🎨 Creating reusable UI components
- 📱 Developing SPAs without heavy frameworks
- 🎓 Learning modern web development
- 🚀 Prototyping quickly

## 📄 License

MIT © KinoGlazPrusia

**Free for all uses** - personal, educational, commercial, and open source projects.

See [usage guidelines](./TERMS.md) for community best practices.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Issue Tracker](https://github.com/KinoGlazPrusia/plain/issues)
- 💬 [Discussions](https://github.com/KinoGlazPrusia/plain/discussions)

---

*Built with ❤️ for the web development community* 