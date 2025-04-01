# Styles

PlainStyle provides a system for handling encapsulated styles in components, leveraging Shadow DOM to isolate styles and prevent conflicts between components.

## Basic Usage of PlainStyle

PlainStyle is used internally in PlainComponent, so you typically won't need to create PlainStyle instances directly. However, it's useful to understand how it works to make the most of the styling system.

## Component Structure and Wrapper

When a component is created, Plain automatically creates a wrapper element with a class in the format `{componentName}-wrapper`. This wrapper contains all the elements defined in your template and is an important part of the component structure:

```
Shadow DOM
└── styles (CSS)
└── {componentName}-wrapper (div)
    └── Your component's template content
```

The wrapper has the following characteristics:
- It's a `<div>` element with the class `{componentName}-wrapper`
- It has an attribute `plan="wrapper"`
- All selectors in your template should target elements within this wrapper

This is important to understand when writing styles, as you can target the wrapper directly:

```css
/* Target the wrapper */
.my-component-wrapper {
    display: flex;
    flex-direction: column;
}

/* Target elements inside the wrapper */
.my-component-wrapper .title {
    font-size: 24px;
}
```

### How Styles Are Loaded

When you create a component with PlainComponent, styles are automatically loaded from the CSS file you specify in the constructor:

```javascript
import { PlainComponent } from 'plain-reactive'

class MyComponent extends PlainComponent {
    constructor() {
        super('my-component', 'path/to/MyComponent.css')
        // ...
    }
    // ...
}
```

Internally, PlainComponent creates a PlainStyle instance and loads the specified CSS file. The styles are added to the component's Shadow DOM, ensuring they only affect this component and not other elements on the page.

### Internal Workings

The PlainStyle class acts as a singleton, which means only one instance of PlainStyle exists across the entire application. This allows CSS files to be loaded once and reused across multiple instances of the same component.

## Styling Components

Plain's styling system allows each component to have its own style rules that only apply to that component, similar to the Shadow DOM in Web Components but with a simpler implementation.

## Writing Styles for Components

### Using the :host Selector

The `:host` selector refers to the component element itself. It's useful for applying styles to the component's main container:

```css
/* MyComponent.css */
:host {
    display: block;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}
```

### Styles for Internal Elements

To apply styles to internal elements in the component, simply use normal selectors:

```css
/* MyComponent.css */
.title {
    font-size: 24px;
    color: #333;
    margin-bottom: 16px;
}

.button {
    background-color: #0066cc;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #0052a3;
}
```

### Conditional Styles

You can combine styles with component state using dynamic classes in your template:

```javascript
template() {
    return `
        <button class="button ${this.active.getState() ? 'active' : 'inactive'}">
            ${this.active.getState() ? 'Activated' : 'Deactivated'}
        </button>
    `
}
```

```css
/* MyComponent.css */
.button.active {
    background-color: #00cc66;
}

.button.inactive {
    background-color: #cc0033;
}
```

## Complete Example

### JavaScript Component

```javascript
// Card.js
import { PlainComponent, PlainState } from 'plain-reactive'

class Card extends PlainComponent {
    constructor() {
        super('card', 'components/Card/Card.css')
        
        this.expanded = new PlainState(false, this)
    }
    
    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="card ${this.expanded.getState() ? 'expanded' : 'collapsed'}">
                <div class="header">
                    <h2 class="title">Card Title</h2>
                    <button class="toggle">
                        ${this.expanded.getState() ? '▼' : '►'}
                    </button>
                </div>
                
                <div class="content">
                    <p>This is the card content that shows or hides depending on the state.</p>
                    <a href="#" class="link">More information</a>
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$('.toggle').onclick = () => this.toggleExpanded()
    }
    
    toggleExpanded() {
        this.expanded.setState(!this.expanded.getState())
    }
}

export default customElements.define('my-card', Card)
```

### CSS File

```css
/* Card.css */
:host {
    display: block;
    margin: 10px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Target the wrapper directly */
.card-wrapper {
    padding: 10px;
    background-color: #f8f8f8;
}

.card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #eee;
}

.title {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.toggle {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
}

.content {
    padding: 0 16px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
}

.card.expanded .content {
    max-height: 200px;
    padding: 16px;
}

.card.collapsed .content {
    max-height: 0;
    padding: 0 16px;
}

.link {
    display: inline-block;
    color: #0066cc;
    text-decoration: none;
    margin-top: 8px;
}

.link:hover {
    text-decoration: underline;
}
```

### HTML Usage

```html
<my-card></my-card>
```

## Tips and Best Practices

1. **Remember the wrapper structure**: Your template content is always wrapped in a div with the class `{componentName}-wrapper`.

2. **Keep component-specific styles**: Use Shadow DOM encapsulation to create modular and reusable components.

3. **Use semantic class names**: Class names should describe what the element represents, not its appearance.

4. **Organize your styles**: Group related styles and add comments to explain complex sections.

5. **Leverage CSS variables**: For theming and customization, use CSS variables:

```css
:host {
    --primary-color: #0066cc;
    --secondary-color: #00cc66;
    --base-spacing: 8px;
}

.button {
    background-color: var(--primary-color);
    padding: calc(var(--base-spacing) * 2);
    margin: var(--base-spacing);
}
```

6. **Use state for dynamic styles**: Combine component state with CSS classes to create dynamic and reactive interfaces. 

---

[Back to README](./README.md) 