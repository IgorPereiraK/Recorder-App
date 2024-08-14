const {app, BrowserWindow, ipcMain, Menu, globalShortcut, webContents, shell} = require('electron')
const path = require('path') 
const os = require('os')
const fs = require('fs')
let destination = path.join(os.homedir(), 'Audios-Gravador')

const isDev = process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development" ? true : false

const isMac = process.platform === 'darwin' ? true : false

function createWindow() {
    const win = new BrowserWindow({
        width: isDev ? 950 : 1000,
        resizable: isDev ? true : false,
        height: 500,
        backgroundColor: '#234',
        icon: path.join(__dirname, "assets", "icon", "icon.png"),
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile("./src/mainWindow/index.html")

    if(isDev) {
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', () => {
        win.show()
        setTimeout(() => {
            win.webContents.send("cpu_name", os.cpus()[0].model)
        }, 3000)
    })

    const menuTemplate = [
        {
            label: app.name,
            submenu: [
                { label: "Preferences", click: () => {} },
                { label: "Open destination folder", click: () => { shell.openPath(destination) } },
                { label: "Console", click: () => { win.webContents.openDevTools()} }
            ]
        },

        {
            label: 'File',
            submenu: [
                isMac ? { role: "close" } : { role: "quit" }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

}

app.whenReady().then(() => {
    createWindow()
})

app.on("window-all-closed", () => {
    console.log("Todas as janelas fechadas")
    if(!isMac) {
        app.quit()
    }
})

app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("open_new_window", () => {
    createWindow()
})

ipcMain.on("save_buffer", (e, buffer) => {
    const filePath = path.join(destination, `${Date.now()}`)
    fs.writeFileSync(`${filePath}.webm`, buffer)
})