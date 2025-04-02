import { PlainComponent } from '../../../node_modules/plain-reactive/src/index.js'

class HomePage extends PlainComponent {
    constructor() {
        super('home-page', './src/components/HomePage/HomePage.css')
    }
    
    template() {
        return `
            <div class="container">
                <h2>Welcome to {{APP_NAME}}</h2>
                <p>A lightweight framework for building reactive web components with vanilla JavaScript.</p>
                
                <div class="features">
                    <div class="feature">
                        <h3>Components</h3>
                        <p>Create reusable web components using the Custom Elements API.</p>
                    </div>
                    <div class="feature">
                        <h3>Reactivity</h3>
                        <p>Automatic UI updates with a simple state management system.</p>
                    </div>
                    <div class="feature">
                        <h3>No Dependencies</h3>
                        <p>100% vanilla JavaScript with zero external dependencies.</p>
                    </div>
                </div>
            </div>
        `
    }
}

export default window.customElements.define('home-page', HomePage) 