const fs = require('fs')
const path = require('path')
const readline = require('readline')

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

const normalizeComponentName = (name) => {
    // Split by non-alphanumeric characters and camelCase boundaries
    const words = name
        .replace(/[^a-zA-Z0-9]/g, ' ') // Replace special chars with spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
        .split(/\s+/) // Split by spaces
        .filter(word => word.length > 0) // Remove empty strings
    
    // Convert each word to Title Case and join
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')
}

const folderExists = (path) => {
    return fs.existsSync(path)
}

const createFolder = async (kwargs, path, y=null) => {
    return new Promise (resolve => {
        if (y) {
            fs.mkdirSync(path)
            resolve()
            return
        }
    
        rl.question(`The folder ${kwargs.folder} doesn't exist. Do you want to create it? (Y/n) `, (answer) => {
            if (['y', ''].includes(answer.toLowerCase())) {
                fs.mkdirSync(path)
            } else {
                console.error('The folder was not created. Please create it manually or use another folder name.')
                process.exit(1)
            }
            rl.close()
            resolve()
        })
    })
}

const changeComponentName = async (kwargs, name) => {
    return new Promise ((resolve, reject) => {
        const askNewName = () => {
            rl.question(`The component ${name} already exists. Do you want to use another name? (Y/n) `, (answer) => {
                if (!['y', ''].includes(answer.toLocaleLowerCase())) {
                    console.error('The component was not created. Please create it manually or use another name.')
                    rl.close()
                    process.exit(1)
                }

                rl.question('Please, enter the new name: ', (newName) => {
                    if (newName.length === 0) {
                        console.error('You have to provide a name for the component. Example: npm run create src ComponentName')
                        rl.close()
                        process.exit(1)
                    }

                    const normalizedName = normalizeComponentName(newName)
                    kwargs.components[kwargs.components.indexOf(name)] = normalizedName
                    resolve(normalizedName)
                })
            })
        }

        askNewName()
    })
}

/* ============================================================================================================= */
// BUSINESS LOGIC
/* ============================================================================================================= */
async function main() {
    const components = process.argv.slice(2) // npm run create [folderName] [componentName-1] [componentName-2] ...

    let folderName = components[0]
    let componentNames = components.slice(1)

    // If no folder name is provided, ask for it
    if (!folderName) {
        folderName = await question("Root folder name: ")
        if (!folderName) {
            console.error('You have to provide a root folder name. Example: npm run create src ComponentName')
            rl.close()
            process.exit(1)
        }
    }

    // If no component names are provided, ask for at least one
    if (componentNames.length === 0) {
        const componentInput = await question("Component name(s) (separate multiple components with spaces): ")
        if (!componentInput) {
            console.error('You have to provide at least one component name. Example: npm run create src ComponentName')
            rl.close()
            process.exit(1)
        }
        // Split the input by spaces and filter out empty strings
        componentNames = componentInput.split(/\s+/).filter(name => name.trim().length > 0)
        
        if (componentNames.length === 0) {
            console.error('You have to provide at least one valid component name.')
            rl.close()
            process.exit(1)
        }
    }
    
    // Normalize component names (First letter uppercase, rest lowercase)
    componentNames = componentNames.map(name => normalizeComponentName(name))
    
    // Store arguments in a dictionary
    const kwargs = {
        folder: folderName,
        components: componentNames
    }
    
    // Check if the root folder exists and if not, create it
    const fullPath = path.join(process.cwd(), kwargs.folder)
    if (!folderExists(fullPath)) {
        await createFolder(kwargs, fullPath)
    }
    
    // Process components
    for (const component of kwargs.components) {
        // Check if the component folder exists and if not, create it
        const folderPath = path.join(fullPath, component)
        if (!folderExists(folderPath)) {
           await createFolder(kwargs, folderPath, true)
        }
    
        // If it already exists, warn the user and ask for another name
        else {
            const newName = await changeComponentName(kwargs, component)
            const folderPath = path.join(fullPath, newName)
            await createFolder(kwargs, folderPath, true)
        }
    
        // Create the CSS and the JS files within the component folder
        const componentName = kwargs.components[kwargs.components.indexOf(component)]

        const CLASS_NAME = componentName
        const COMPONENT_NAME = componentName.split(/(?=[A-Z])/).join('-').toLowerCase()
        const RELATIVE_CSS_PATH = `${kwargs.folder}/${componentName}/${componentName}.css`
        
        let jsBoilerplate = fs.readFileSync(path.join(__dirname, 'templates/boilerplates/component.js'), 'utf8')
        let cssBoilerplate = fs.readFileSync(path.join(__dirname, 'templates/boilerplates/component.css'), 'utf8')

        jsBoilerplate = jsBoilerplate.replace(/{{CLASS_NAME}}/g, CLASS_NAME)
        jsBoilerplate = jsBoilerplate.replace(/{{COMPONENT_NAME}}/g, COMPONENT_NAME)
        jsBoilerplate = jsBoilerplate.replace(/{{RELATIVE_CSS_PATH}}/g, RELATIVE_CSS_PATH)
        cssBoilerplate = cssBoilerplate.replace(/{{COMPONENT_NAME}}/g, COMPONENT_NAME)

        fs.writeFileSync(path.join(folderPath, `${componentName}.js`), jsBoilerplate)
        fs.writeFileSync(path.join(folderPath, `${componentName}.css`), cssBoilerplate)
    }

    rl.close()
}

main().catch(error => {
    console.error("An error has occurred:", error)
    process.exit(1)
})