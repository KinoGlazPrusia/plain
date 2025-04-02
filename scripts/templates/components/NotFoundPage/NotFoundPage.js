import { PlainComponent } from '../../../node_modules/plain-reactive/src/index.js'

class NotFoundPage extends PlainComponent {
    constructor() {
        super('not-found-page', './src/components/NotFoundPage/NotFoundPage.css')
    }
    
    template() {
        return `
            <div class="container">
                <div class="not-found">
                    <h2>404</h2>
                    <p>Oops! The page you're looking for doesn't exist.</p>
                    <a href="/" class="home-link">Go to Home</a>
                </div>
            </div>
        `
    }
    
    listeners() {
        this.$('.home-link').addEventListener('click', (e) => {
            e.preventDefault()
            // Access parent/app component for navigation
            const app = document.querySelector('app-root')
            if (app && typeof app.navigateTo === 'function') {
                app.navigateTo('/')
            } else {
                // Fallback if we can't access the navigateTo function
                window.location.href = '/'
            }
        })
    }
}

export default window.customElements.define('not-found-page', NotFoundPage) 