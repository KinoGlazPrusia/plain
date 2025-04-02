import { PlainComponent, PlainState } from '../../../node_modules/plain-reactive/src/index.js'
import '../HomePage/HomePage.js'
import '../AboutPage/AboutPage.js'
import '../NotFoundPage/NotFoundPage.js'
import '../DocsPage/DocsPage.js'

class App extends PlainComponent {
    constructor() {
        super('app-root', './src/components/App/App.css')
        
        // Estado para la navegación
        this.currentRoute = new PlainState('/', this)
        
        // Manejar cambios en la URL
        window.addEventListener('popstate', this.handleRouteChange.bind(this))
        
        // Inicializar la ruta basada en la URL actual
        this.handleRouteChange()
    }
    
    handleRouteChange() {
        const path = window.location.pathname || '/'
        this.currentRoute.setState(path)
    }
    
    navigateTo(path) {
        // Actualizar la URL sin recargar la página
        window.history.pushState(null, null, path)
        this.currentRoute.setState(path)
    }
    
    template() {
        return `
            <div class="app">
                <header class="header">
                    <div class="container">
                        <h1 class="logo">{{APP_NAME}}</h1>
                        <nav class="nav">
                            <a href="/" class="nav-link ${this.currentRoute.getState() === '/' ? 'active' : ''}">Home</a>
                            <a href="/about" class="nav-link ${this.currentRoute.getState() === '/about' ? 'active' : ''}">About</a>
                            <a href="/docs" class="nav-link ${this.currentRoute.getState() === '/docs' ? 'active' : ''}">Docs</a>
                        </nav>
                    </div>
                </header>
                
                <main id="content" class="content">
                    ${this.renderCurrentPage()}
                </main>
                
                <footer class="footer">
                    <div class="container">
                        <p>&copy; ${new Date().getFullYear()} {{APP_NAME}}</p>
                    </div>
                </footer>
            </div>
        `
    }
    
    renderCurrentPage() {
        const route = this.currentRoute.getState()
        
        switch(route) {
            case '/':
                return '<home-page></home-page>'
            case '/about':
                return '<about-page></about-page>'
            case '/docs':
                return '<docs-page></docs-page>'
            default:
                return '<not-found-page></not-found-page>'
        }
    }
    
    listeners() {
        // Capturar clics en enlaces de navegación
        const navLinks = this.$$('.nav-link')
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const path = link.getAttribute('href')
                this.navigateTo(path)
            })
        })
    }
}

export default window.customElements.define('app-root', App) 