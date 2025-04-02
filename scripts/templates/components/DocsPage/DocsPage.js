import { PlainComponent, PlainState } from '../../../node_modules/plain-reactive/src/index.js'

class DocsPage extends PlainComponent {
    constructor() {
        super('docs-page', './src/components/DocsPage/DocsPage.css')
        
        // Available documentation list
        this.docs = [
            { id: 'README', name: 'Introduction' },
            { id: 'installation', name: 'Installation' },
            { id: 'components', name: 'Components' },
            { id: 'state', name: 'State' },
            { id: 'router', name: 'Router' },
            { id: 'context', name: 'Context' },
            { id: 'signals', name: 'Signals' },
            { id: 'styles', name: 'Styles' }
        ]
        
        // Current document state
        this.currentDoc = new PlainState('README', this)
        
        // Document content state
        this.docContent = new PlainState('<p>Loading documentation...</p>', this)
        
        // Load marked from CDN if not available
        this.loadMarked()
    }
    
    loadMarked() {
        // If marked is already available globally, do nothing
        if (window.marked) {
            this.onMarkedLoaded()
            return
        }
        
        // If not available, load it from CDN
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js'
        script.onload = () => this.onMarkedLoaded()
        script.onerror = () => {
            console.error('Error loading marked from CDN')
            this.docContent.setState('<p>Error loading markdown processor. Please reload the page.</p>')
        }
        document.head.appendChild(script)
    }
    
    onMarkedLoaded() {
        // Configure marked.js
        window.marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true
        })
        
        // Load initial document
        this.loadDoc(this.currentDoc.getState())
    }
    
    async loadDoc(docId) {
        if (!window.marked) {
            this.docContent.setState('<p>Markdown processor is not ready. Please wait a moment...</p>')
            return
        }
        
        try {
            const response = await fetch(`./assets/docs/${docId}.md`)
            if (!response.ok) throw new Error(`Error loading document: ${response.status}`)
            
            const content = await response.text()
            const htmlContent = window.marked.parse(content)
            this.docContent.setState(htmlContent)
            this.currentDoc.setState(docId)
            
            // Mark active link
            this.updateActiveLink()
        } catch (error) {
            console.error('Error loading document:', error)
            this.docContent.setState('<p>Error loading the document. Please try again.</p>')
        }
    }
    
    updateActiveLink() {
        const links = this.$$('.doc-nav-item')
        links.forEach(link => {
            const docId = link.dataset.docId
            if (docId === this.currentDoc.getState()) {
                link.classList.add('active')
            } else {
                link.classList.remove('active')
            }
        })
    }
    
    template() {
        return `
            <div class="docs-container">
                <aside class="doc-sidebar">
                    <h3>Documentation</h3>
                    <nav class="doc-nav">
                        ${this.docs.map(doc => `
                            <a href="#${doc.id}" class="doc-nav-item" data-doc-id="${doc.id}">
                                ${doc.name}
                            </a>
                        `).join('')}
                    </nav>
                </aside>
                
                <main class="doc-content">
                    <div class="markdown-content">
                        ${this.docContent.getState()}
                    </div>
                </main>
            </div>
        `
    }
    
    listeners() {
        // Handle clicks on navigation links
        const docLinks = this.$$('.doc-nav-item')
        docLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const docId = link.dataset.docId
                this.loadDoc(docId)
                
                // Scroll the doc-content container to top smoothly
                const docContent = this.$('.doc-content')
                if (docContent) {
                    docContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            })
        })
    }
}

export default window.customElements.define('docs-page', DocsPage) 