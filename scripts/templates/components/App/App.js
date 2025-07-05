import { PlainComponent, PlainRouter } from '../../../node_modules/plain-reactive/src/index.js'
import '../HomePage/HomePage.js'
import '../AboutPage/AboutPage.js'
import '../NotFoundPage/NotFoundPage.js'
import '../DocsPage/DocsPage.js'

class App extends PlainComponent {
    constructor() {
        super('app-root', './src/components/App/App.css')
        this.router = new PlainRouter('/', this)
    }
    
    template() {
        return this.html`
            <div class="app">
                <header class="header">
                    <div class="container">
                        <h1 class="logo">Playground</h1>
                        <nav class="nav">
                            <a href="/" class="nav-link ${this.router.currentRoute === '/' ? 'active' : ''}">Home</a>
                            <a href="/about" class="nav-link ${this.router.currentRoute === '/about' ? 'active' : ''}">About</a>
                            <a href="/docs" class="nav-link ${this.router.currentRoute === '/docs' ? 'active' : ''}">Docs</a>
                        </nav>
                    </div>
                </header>
                
                <main id="content" class="content">
                    ${this.router.setup({
                        '/': '<home-page></home-page>',
                        '/about': '<about-page></about-page>',
                        '/docs': '<docs-page></docs-page>',
                        '*': '<not-found-page></not-found-page>',
                    })}
                </main>
                
                <footer class="footer">
                    <div class="container">
                        <p>&copy; ${new Date().getFullYear()} Playground</p>
                    </div>
                </footer>
            </div>
        `
    }
    
    listeners() {
        // Capturar clics en enlaces de navegación
        const navLinks = this.$$('.nav-link')
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const path = link.getAttribute('href')
                this.router.navigateTo(path)
            })
        })
    }
}

export default window.customElements.define('app-root', App) 