# Router

The PlainRouter class provides a simple routing system for single-page applications.

## Routing System for SPAs

PlainRouter enables you to create single-page applications by handling URL changes and rendering different components based on the current route.

## Usage

### Initialization

The router is accessed through a singleton instance:

```javascript
import { PlainComponent, PlainRouter } from 'plain-reactive'

class MyApp extends PlainComponent {
    constructor() {
        super('my-app')
        
        // Access the router
        this.router = PlainRouter
        
        // Initialize the router
        this.initializeRouter()
    }
    
    initializeRouter() {
        // Configure routes
        this.router.setRoutes({
            '/': { component: 'home-page' },
            '/about': { component: 'about-page' },
            '/products': { component: 'products-page' },
            '/products/:id': { component: 'product-detail' },
            '/contact': { component: 'contact-page' },
            '*': { component: 'not-found-page' }  // Fallback route (404)
        })
        
        // Start the router
        this.router.start()
    }
    
    // ...
}
```

### Getting the Current Route

To get information about the current route:

```javascript
// Get the current route path
const currentPath = this.router.getCurrentRoute()
console.log('Current path:', currentPath)

// Get route parameters
const params = this.router.getParams()
console.log('Route parameters:', params)

// Example: For route "/products/42", params would be { id: "42" }
```

### Defining Routes

Routes are defined using a configuration object where:
- Keys are URL patterns
- Values are objects with properties:
  - `component`: The custom element tag to render (required)
  - `title`: Document title to set when the route is active (optional)

Special URL pattern features:
- `:paramName` - Defines a route parameter (e.g., `/products/:id`)
- `*` - Wildcard route (catch-all for 404 pages)

```javascript
this.router.setRoutes({
    '/': { 
        component: 'home-page',
        title: 'Home - My App'
    },
    '/about': { 
        component: 'about-page',
        title: 'About Us - My App'
    },
    '/products': { 
        component: 'products-page',
        title: 'Products - My App'
    },
    '/products/:id': { 
        component: 'product-detail',
        title: 'Product Details - My App'
    },
    '/contact': { 
        component: 'contact-page',
        title: 'Contact Us - My App'
    },
    '*': { 
        component: 'not-found-page',
        title: '404 Not Found - My App'
    }
})
```

### Navigation

For client-side navigation without page reloads, use the `navigateTo()` method:

```javascript
// Navigate to the about page
this.router.navigateTo('/about')

// Navigate to a product detail page with a parameter
this.router.navigateTo(`/products/${productId}`)
```

For links in your HTML, use the data-attribute `data-link`:

```javascript
template() {
    // Use lit-html extension for HTML syntax highlighting
    return html`
        <nav>
            <a href="/" data-link>Home</a>
            <a href="/about" data-link>About</a>
            <a href="/products" data-link>Products</a>
            <a href="/contact" data-link>Contact</a>
        </nav>
    `
}
```

The router automatically intercepts clicks on links with the `data-link` attribute to perform client-side navigation.

## Complete Example of an SPA Application

```javascript
// app.js
import { PlainComponent, PlainRouter } from 'plain-reactive'
import './pages/HomePage.js'
import './pages/AboutPage.js'
import './pages/ProductsPage.js'
import './pages/ProductDetail.js'
import './pages/ContactPage.js'
import './pages/NotFoundPage.js'

class App extends PlainComponent {
    constructor() {
        super('my-app', 'components/App/App.css')
        this.router = PlainRouter
        
        // Configure routes
        this.router.setRoutes({
            '/': { component: 'home-page', title: 'Home - My App' },
            '/about': { component: 'about-page', title: 'About - My App' },
            '/products': { component: 'products-page', title: 'Products - My App' },
            '/products/:id': { component: 'product-detail', title: 'Product Details - My App' },
            '/contact': { component: 'contact-page', title: 'Contact - My App' },
            '*': { component: 'not-found-page', title: '404 Not Found - My App' }
        })
        
        // Start the router
        this.router.start()
    }

    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="app">
                <header>
                    <h1>My SPA App</h1>
                    <nav>
                        <a href="/" data-link>Home</a>
                        <a href="/about" data-link>About</a>
                        <a href="/products" data-link>Products</a>
                        <a href="/contact" data-link>Contact</a>
                    </nav>
                </header>
                
                <main id="content">
                    <!-- Route components will be rendered here -->
                </main>
                
                <footer>
                    <p>&copy; 2023 My SPA App</p>
                </footer>
            </div>
        `
    }
}

export default customElements.define('my-app', App)
```

```javascript
// HomePage.js
import { PlainComponent } from 'plain-reactive'

class HomePage extends PlainComponent {
    constructor() {
        super('home-page', 'pages/HomePage/HomePage.css')
    }

    template() {
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="home">
                <h2>Welcome to My SPA App</h2>
                <p>This is the homepage of our single-page application.</p>
            </div>
        `
    }
}

export default customElements.define('home-page', HomePage)
```

```javascript
// ProductDetail.js
import { PlainComponent, PlainRouter, PlainState } from 'plain-reactive'

class ProductDetail extends PlainComponent {
    constructor() {
        super('product-detail', 'pages/ProductDetail/ProductDetail.css')
        this.router = PlainRouter
        
        // Get product ID from route parameters
        const params = this.router.getParams()
        this.productId = params.id
        
        // State for product data
        this.product = new PlainState(null, this)
        
        // Load product data when component is created
        this.loadProduct()
    }
    
    template() {
        const product = this.product.getState()
        
        if (!product) {
            // Use lit-html extension for HTML syntax highlighting
            return html`<div class="loading">Loading product data...</div>`
        }
        
        // Use lit-html extension for HTML syntax highlighting
        return html`
            <div class="product-detail">
                <h2>${product.name}</h2>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="back-btn">Back to Products</button>
            </div>
        `
    }
    
    listeners() {
        if (this.product.getState()) {
            this.$('.back-btn').onclick = () => {
                this.router.navigateTo('/products')
            }
        }
    }
    
    async loadProduct() {
        // Simulated API call
        // In a real app, fetch from your API
        setTimeout(() => {
            // Example product data
            this.product.setState({
                id: this.productId,
                name: `Product ${this.productId}`,
                price: Math.floor(Math.random() * 100) + 9.99,
                description: `This is the detailed description for product ${this.productId}.`
            })
        }, 500)
    }
}

export default customElements.define('product-detail', ProductDetail)
```

Use it in HTML:

```html
<my-app></my-app>
```

---

[Back to README](./README.md) 