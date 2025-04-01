# Installation and Setup

There are multiple ways to install and integrate the Plain library into your project.

## Installation Options

### Option 1: Install via npm

```bash
npm install plain-reactive
```

Then import in your JavaScript:

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

### Option 2: Import from CDN

```html
<script type="module">
    import { 
        PlainComponent, 
        PlainState, 
        PlainSignal, 
        PlainContext, 
        PlainRouter,
        PlainStyle
    } from 'https://cdn.jsdelivr.net/npm/plain-reactive/dist/plain.js'
</script>
```

### Option 3: Download and Import Locally

Download the library from GitHub and include it in your project:

```javascript
import { 
    PlainComponent, 
    PlainState, 
    PlainSignal, 
    PlainContext, 
    PlainRouter,
    PlainStyle
} from './path/to/plain.js'
```

## Recommended File Structure

While Plain is flexible and works with any project structure, here's a recommended organization for your components:

```
project/
├── index.html
├── index.js
├── components/
│   ├── App/
│   │   ├── App.js
│   │   └── App.css
│   ├── Header/
│   │   ├── Header.js
│   │   └── Header.css
│   └── Footer/
│       ├── Footer.js
│       └── Footer.css
└── services/
    ├── api.js
    └── utils.js
```

## Quick Setup

Here's how to quickly set up a new project:

1. Create the project structure
2. Install Plain (if using npm)
3. Create your main HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My Plain App</title>
    <script type="module" src="index.js"></script>
</head>
<body>
    <my-app></my-app>
</body>
</html>
```

4. Create your main JavaScript file (index.js):

```javascript
import './components/App/App.js'
```

5. Create your first component:

```javascript
// components/App/App.js
import { PlainComponent } from 'plain-reactive'

class App extends PlainComponent {
    constructor() {
        super('app', 'components/App/App.css')
    }
    
    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`<h1>Hello Plain!</h1>`
    }
}

customElements.define('my-app', App)
```

---

[Back to README](./README.md)