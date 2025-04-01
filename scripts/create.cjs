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

                    kwargs.components[kwargs.components.indexOf(name)] = newName
                    resolve(newName)
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

    // Check the minimum arguments are present in the command
    if (components.length < 2) {
        console.error('You have to provide the root folder name and at least one component name. Example: npm run create src ComponentName')
        process.exit(1)
    }   
    
    // Store arguments in a dictionary
    const kwargs = {
        folder: components[0],
        components: components.slice(1)
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
        
        let jsBoilerplate = fs.readFileSync(path.join(__dirname, 'create-boilerplate.js'), 'utf8')
        let cssBoilerplate = fs.readFileSync(path.join(__dirname, 'create-boilerplate.css'), 'utf8')

        jsBoilerplate = jsBoilerplate.replace(/{{CLASS_NAME}}/g, CLASS_NAME)
        jsBoilerplate = jsBoilerplate.replace(/{{COMPONENT_NAME}}/g, COMPONENT_NAME)
        jsBoilerplate = jsBoilerplate.replace(/{{RELATIVE_CSS_PATH}}/g, RELATIVE_CSS_PATH)
        cssBoilerplate = cssBoilerplate.replace(/{{COMPONENT_NAME}}/g, COMPONENT_NAME)

        fs.writeFileSync(path.join(folderPath, `${componentName}.js`), jsBoilerplate)
        fs.writeFileSync(path.join(folderPath, `${componentName}.css`), cssBoilerplate)
    }
}

main().catch(error => {
    console.error("An error has occurred:", error)
    process.exit(1)
})