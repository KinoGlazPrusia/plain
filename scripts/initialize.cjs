const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync, exec } = require('child_process')

/* ============================================================================================================= */
// FUNCTION DEFINITIONS
/* ============================================================================================================= */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (query) => {
    return new Promise(resolve => {
        rl.question(query, answer => {
            resolve(answer)
        })
    })
}

const folderExists = (path) => {
    return fs.existsSync(path)
}

const createFolder = (folderPath) => {
    if (!folderExists(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
        console.log(`✅ Folder created: ${folderPath}`)
    } else {
        console.log(`⚠️ Folder already exists: ${folderPath}`)
    }
}

const createFile = (filePath, content) => {
    fs.writeFileSync(filePath, content)
    console.log(`✅ File created: ${filePath}`)
}

const copyFile = (sourcePath, destinationPath) => {
    fs.copyFileSync(sourcePath, destinationPath)
    console.log(`✅ File copied: ${destinationPath}`)
}

const readTemplate = (templatePath) => {
    return fs.readFileSync(path.join(__dirname, 'templates', templatePath), 'utf8')
}

// Función para ejecutar comandos de forma asíncrona
const runCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        console.log(`\n🔧 Executing: ${command}`)
        
        const childProcess = exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error executing ${command}:`, error)
                reject(error)
                return
            }
            resolve({ stdout, stderr })
        })
        
        // Mostrar la salida en tiempo real
        childProcess.stdout.pipe(process.stdout)
        childProcess.stderr.pipe(process.stderr)
    })
}

/* ============================================================================================================= */
// BUSINESS LOGIC
/* ============================================================================================================= */
async function main() {
    try {
        console.log("=".repeat(80))
        console.log("🚀 Initializing new project with Plain")
        console.log("=".repeat(80))
        
        // Get project name and location
        const projectName = await question("Project name: ")
        if (!projectName) {
            console.error("❌ Project name is required.")
            process.exit(1)
        }
        
        const projectPath = await question("Project location (relative or absolute path, default current directory): ")
        
        // Determine full project path
        const fullProjectPath = projectPath 
            ? path.resolve(process.cwd(), projectPath, projectName) 
            : path.join(process.cwd(), projectName)
        
        if (folderExists(fullProjectPath) && fs.readdirSync(fullProjectPath).length > 0) {
            const overwrite = await question("⚠️ Folder exists and is not empty. Do you want to continue? (s/N): ")
            if (overwrite.toLowerCase() !== 's') {
                console.log("❌ Operation cancelled by user.")
                process.exit(0)
            }
        }
        
        // Create project folder structure
        console.log("\n📁 Creating folder structure...")
        createFolder(fullProjectPath)
        createFolder(path.join(fullProjectPath, 'src'))
        createFolder(path.join(fullProjectPath, 'src/components'))
        createFolder(path.join(fullProjectPath, 'src/components/App'))
        createFolder(path.join(fullProjectPath, 'src/components/HomePage'))
        createFolder(path.join(fullProjectPath, 'src/components/AboutPage'))
        createFolder(path.join(fullProjectPath, 'src/components/NotFoundPage'))
        createFolder(path.join(fullProjectPath, 'src/components/DocsPage'))
        createFolder(path.join(fullProjectPath, 'assets'))
        createFolder(path.join(fullProjectPath, 'assets/css'))
        createFolder(path.join(fullProjectPath, 'assets/images'))
        createFolder(path.join(fullProjectPath, 'assets/docs'))
        createFolder(path.join(fullProjectPath, 'scripts'))
        
        // Create files
        console.log("\n📄 Creating files...")
        const projectNameLower = projectName.toLowerCase().replace(/\s+/g, '-')
        
        // Read templates from files and process them
        const templates = {
            // HTML and CSS
            [path.join(fullProjectPath, 'index.html')]: 
                readTemplate('index.html').replace(/{{APP_NAME}}/g, projectName),
                
            [path.join(fullProjectPath, 'assets/css/main.css')]: 
                readTemplate('main.css'),
            
            // Main JavaScript
            [path.join(fullProjectPath, 'src/index.js')]: 
                readTemplate('index.js'),
            
            // App Component
            [path.join(fullProjectPath, 'src/components/App/App.js')]: 
                readTemplate('components/App/App.js').replace(/{{APP_NAME}}/g, projectName),
                
            [path.join(fullProjectPath, 'src/components/App/App.css')]: 
                readTemplate('components/App/App.css'),
            
            // Home Component
            [path.join(fullProjectPath, 'src/components/HomePage/HomePage.js')]: 
                readTemplate('components/HomePage/HomePage.js').replace(/{{APP_NAME}}/g, projectName),
                
            [path.join(fullProjectPath, 'src/components/HomePage/HomePage.css')]: 
                readTemplate('components/HomePage/HomePage.css'),
            
            // About Component
            [path.join(fullProjectPath, 'src/components/AboutPage/AboutPage.js')]: 
                readTemplate('components/AboutPage/AboutPage.js').replace(/{{APP_NAME}}/g, projectName),
                
            [path.join(fullProjectPath, 'src/components/AboutPage/AboutPage.css')]: 
                readTemplate('components/AboutPage/AboutPage.css'),
            
            // Not Found Component
            [path.join(fullProjectPath, 'src/components/NotFoundPage/NotFoundPage.js')]: 
                readTemplate('components/NotFoundPage/NotFoundPage.js'),
                
            [path.join(fullProjectPath, 'src/components/NotFoundPage/NotFoundPage.css')]: 
                readTemplate('components/NotFoundPage/NotFoundPage.css'),
            
            // Docs Component
            [path.join(fullProjectPath, 'src/components/DocsPage/DocsPage.js')]: 
                readTemplate('components/DocsPage/DocsPage.js'),
                
            [path.join(fullProjectPath, 'src/components/DocsPage/DocsPage.css')]: 
                readTemplate('components/DocsPage/DocsPage.css'),
            
            // Project Config Files
            [path.join(fullProjectPath, 'package.json')]: 
                readTemplate('package.json').replace(/{{APP_NAME_LOWER}}/g, projectNameLower)
        }
        
        // Create all files from templates
        for (const [filePath, content] of Object.entries(templates)) {
            createFile(filePath, content)
        }
        
        // Copy documentation files if they exist
        console.log("\n📄 Copying documentation files...")
        const docsSourceDir = path.join(process.cwd(), 'docs')
        const docsTargetDir = path.join(fullProjectPath, 'assets/docs')
        
        if (fs.existsSync(docsSourceDir)) {
            const docFiles = fs.readdirSync(docsSourceDir)
            
            for (const docFile of docFiles) {
                if (docFile.endsWith('.md')) {
                    const sourcePath = path.join(docsSourceDir, docFile)
                    const targetPath = path.join(docsTargetDir, docFile)
                    
                    copyFile(sourcePath, targetPath)
                }
            }
        } else {
            console.log("⚠️ Documentation folder not found.")
        }
        
        // Copy create.cjs script to project
        const createScriptSource = path.join(process.cwd(), 'scripts/create.cjs')
        if (fs.existsSync(createScriptSource)) {
            copyFile(
                createScriptSource, 
                path.join(fullProjectPath, 'scripts/create.cjs')
            )
            
            // Copy boilerplate files
            const boilerplateFiles = [
                'create-boilerplate.js',
                'create-boilerplate.css'
            ]
            
            for (const file of boilerplateFiles) {
                const sourcePath = path.join(process.cwd(), 'scripts', file)
                if (fs.existsSync(sourcePath)) {
                    copyFile(
                        sourcePath,
                        path.join(fullProjectPath, 'scripts', file)
                    )
                }
            }
        } else {
            console.log("⚠️ create.cjs script not found.")
            // Create a basic version of create.cjs
            createFile(
                path.join(fullProjectPath, 'scripts/create.cjs'),
                fs.readFileSync(path.join(__dirname, 'create.cjs'), 'utf8')
            )
        }
        
        // Generate project structure for README
        let projectStructure = ''
        const generateStructure = (dir, level = 0) => {
            const indent = '    '.repeat(level)
            const items = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const item of items) {
                if (item.name === 'node_modules') continue
                
                if (item.isDirectory()) {
                    projectStructure += `${indent}${item.name}/\n`
                    generateStructure(path.join(dir, item.name), level + 1)
                } else {
                    projectStructure += `${indent}${item.name}\n`
                }
            }
        }
        
        // README.md
        generateStructure(fullProjectPath)
        createFile(
            path.join(fullProjectPath, 'README.md'),
            readTemplate('README.md')
                .replace(/{{APP_NAME}}/g, projectName)
                .replace(/{{PROJECT_STRUCTURE}}/g, projectStructure)
        )
        
        // Finish project creation
        console.log("\n✅ Project initialized successfully!")
        
        // Ask if you want to install dependencies and run the project
        const runSetup = await question("\n¿Do you want to install dependencies and run the project now? (S/n): ")
        
        if (runSetup.toLowerCase() !== 'n') {
            try {
                // Install dependencies
                console.log("\n📦 Installing dependencies...")
                await runCommand('npm install', fullProjectPath)
                
                console.log("\n🎉 Dependencies installed successfully!")
                console.log("\n🚀 Starting development server...")
                
                // Run the server
                await runCommand('npm run start', fullProjectPath)
            } catch (error) {
                console.error("❌ An error occurred during setup:", error.message)
                console.log(`\nTo start manually the project:`)
                console.log(`  1. cd ${path.relative(process.cwd(), fullProjectPath)}`)
                console.log(`  2. npm install`)
                console.log(`  3. npm start`)
            }
        } else {
            console.log(`\nTo start manually the project:`)
            console.log(`  1. cd ${path.relative(process.cwd(), fullProjectPath)}`)
            console.log(`  2. npm install`)
            console.log(`  3. npm start`)
        }
        
        rl.close()
    } catch (error) {
        console.error("❌ Error initializing project:", error)
        console.error(error)
        process.exit(1)
    }
}

main().catch(error => {
    console.error("❌ An unexpected error occurred:", error)
    process.exit(1)
}) 