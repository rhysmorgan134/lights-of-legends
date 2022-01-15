const { app, BrowserWindow, ipcMain } = require('electron')
const Poll = require('./lights/poll')
const poll = new Poll()
const axios = require('axios')
const fs = require('fs')

let version = '12.1'

function createWindow () {
    // Create the browser window.

    axios.get('https://ddragon.leagueoflegends.com/api/versions.json').then((response) => {
        version = response.data[0]
        fs.writeFileSync('./src/version.json', JSON.stringify(response.data))
        console.log("setting version to: ", version)
        axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/champion.json').then((response) => {
            fs.writeFileSync('./src/champions.json', JSON.stringify(response.data))
            axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/item.json').then((response) => {
                fs.writeFileSync('./src/items.json', JSON.stringify(response.data))
                axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/summoner.json').then((response) => {
                    fs.writeFileSync('./src/summonerSpells.json', JSON.stringify(response.data))
                    const win = new BrowserWindow({
                        title: "League of Lights",
                        frame: true,
                        width: 1200,
                        height: 800,
                        webPreferences: {
                            nodeIntegration: true,
                            contextIsolation: false,
                            preload: __dirname + '/preload.js'
                        }
                    })
                    //load the index.html from a url
                    win.loadURL('http://localhost:3000');

                    // Open the DevTools.
                    win.webContents.openDevTools()
                    win.webContents.on('dom-ready', () => {
                        let count = 0

                        poll.on('gameLoaded', (data) => {
                            win.webContents.send('connected', true)
                            win.webContents.send('champs', data)
                        })

                        poll.on('update', (data) => {
                            win.webContents.send('update', data)
                        })

                        poll.on('noGame', (data) => {
                            win.webContents.send('connected', false)
                        })


                    })
                })
            })
        })
    })



}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.