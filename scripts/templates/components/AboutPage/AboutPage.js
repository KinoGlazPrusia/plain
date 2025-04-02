import { PlainComponent } from '../../../node_modules/plain-reactive/src/index.js'

class AboutPage extends PlainComponent {
    constructor() {
        super('about-page', './src/components/AboutPage/AboutPage.css')
    }
    
    template() {
        return `
            <div class="container">
                <h2>About {{APP_NAME}}</h2>
                <p>This project was created with Plain, a lightweight reactive framework for building modern web applications using web components.</p>
                
                <h3>Technology Stack</h3>
                <ul class="tech-stack">
                    <li>PlainComponent - Custom Element framework</li>
                    <li>PlainState - Reactive state management</li>
                    <li>PlainSignal - Component communication</li>
                    <li>PlainRouter - Client-side routing</li>
                    <li>PlainContext - Context API for shared data</li>
                </ul>
            </div>
        `
    }
}

export default window.customElements.define('about-page', AboutPage) 