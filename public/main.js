const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('./lights/Store')
const Poll = require('./lights/poll')
const store = new Store({
    configName: 'settings',
    defaults: {
        wled: false,
        wledURL: '192.168.0.204',
        openRGB: false,
        defaultCol: [255,255,255]
    }
})
let poll = new Poll(store)
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const isDev = require('electron-is-dev');

let versionO = {}
let champions = {}
let summonerSpells = {}
let items = {}



function createWindow () {
    // Create the browser window.

    axios.get('https://ddragon.leagueoflegends.com/api/versions.json').then((response) => {
        version = response.data[0]
        versionO = response.data
        axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/champion.json').then((response) => {
            champions = response.data
            axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/item.json').then((response) => {
                items = response.data
                axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/summoner.json').then((response) => {
                    summonerSpells = response.data
                    const win = new BrowserWindow({
                        title: "League of Lights",
                        frame: false,
                        width: 1200,
                        height: 800,
                        webPreferences: {
                            nodeIntegration: true,
                            contextIsolation: false,
                            preload: __dirname + '/preload.js'
                        }
                    })
                    //load the index.html from a url
                    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

                    // Open the DevTools.
                    if (isDev) {
                        // Open the DevTools.
                        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
                        win.webContents.openDevTools();
                    }
                    win.webContents.on('dom-ready', () => {
                        let count = 0
                        win.webContents.send('version', versionO)
                        win.webContents.send('items', items)
                        win.webContents.send('champions', champions)
                        win.webContents.send('summonerSpells', summonerSpells)
                        ipcMain.on('settingsSave', (message, data) => {
                            if(data[1]) {
                                poll.updateSettings(data[0])
                                app.relaunch()
                                app.quit()
                            } else {
                                poll.updateSettings(data[0])
                            }
                        })

                        ipcMain.on('settings', () => {
                            console.log('settings request')
                            win.webContents.send('settingsRes', poll.getSettings())
                        })
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

                        poll.on('connection', (data) => {
                            win.webContents.send('connection', data)
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