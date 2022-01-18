const EventEmitter = require('events')
const axios = require('axios')
const Player = require('./Player');
const LightController = require('./LightController')
const LightControllerRGB = require('./LightControllerRGB')
const settings = require("./settings.json")
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const path = require('path')
const fs = require('fs')

let rgb = require('./openRGBClass')

class Poll extends EventEmitter {
    constructor(store) {
        super()
        this.wledURL = settings.wledURL
        this.allDataUrl = 'https://127.0.0.1:2999/liveclientdata/allgamedata'
        this.eventsUrl = 'https://127.0.0.1:2999/liveclientdata/eventdata'
        this.playerUrl = 'https://127.0.0.1:2999/liveclientdata/activeplayername'
        this.playersUrl = 'https://127.0.0.1:2999/liveclientdata/playerlist'
        this.store = store
        this.settings = store.getAll()
        this.eventCount = 0
        this.connected = false
        this.players = []
        this.currentName = false
        this.playerOffset = null
        this.lastCreepScore = 0
        this.loaded = false
        this.defaultCol = this.settings.defaultCol
        this.player = new Player()
        if(this.settings.wled) {
            this.light = new LightController(this.settings.wledURL, 0.4, 0.4, this.settings.wled, this.settings.openRGB, this.defaultCol)
            if(this.settings.openRGB) {
                this.rgb = new rgb(this.settings.wledURL)
            }
        } else {
            this.light = new LightControllerRGB(this.defaultCol)
            this.light.connect()
        }

        setInterval(() => {
                this._poll.bind(this)()
        }, 200)

        this.player.on('hpActive',(data) => {
                this.light.lowHp(data)
            })

        this.player.on('hpClear', (data) => {
            this.light.clear()
        })

        this.player.on('hpUpdate', (data) => {
            this.light.lowHp(data)
        })

        setInterval(() => {
            if(this.connected) {
                this.emit('update', this.players)
            }
        }, 10000)

        setInterval(() => {
            this.getConnections()
        }, 1000)

    }


    _poll() {
        axios.get(this.allDataUrl)
            .then((response) => {
                this.player.updateStats(response.data.activePlayer.championStats)
                if (this.connected === false) {
                    this.currentName = response.data.activePlayer.summonerName
                    this.players = response.data.allPlayers
                    this.eventCount = response.data.events.Events.length
                    //console.log(this.players, this.currentName)
                    for(let i=0;i<response.data.allPlayers.length;i++) {
                        //console.log(response.data.allPlayers[i].summonerName, this.currentName)
                        if(response.data.allPlayers[i].summonerName === this.currentName) {
                            this.playerOffset = i
                            console.log("PLAYER OFFSET", i)
                        }
                    }
                    this.light.clear()
                    this.connected = true
                    this.emit('gameLoaded', response.data.allPlayers)
                }
                if(this.connected) {
                    this.parseEvents(response.data.events.Events)
                    this.parseScore(response.data.activePlayer.currentGold)
                    this.players = response.data.allPlayers
                }
            }).catch((error) => {
            if (error.response) {
                this.eventCount = 0
                if (this.connected) {
                    this.light.clear()
                    this.connected = false
                    console.log("disconnected", error.response)
                }
            } else if (error.request) {
                //console.log("error", this, this.eventCount)
                this.eventCount = 0
                if (this.connected) {
                    this.light.clear()
                    this.connected = false
                    console.log("disconnected", error.request)
                }
            } else {
                //console.log("error", this, this.eventCount)
                this.eventCount = 0
                if (this.connected) {
                    this.light.clear()
                    this.connected = false
                    console.log("disconnected", error)
                }
            }
        });
    }

    setDefaultCol(data) {
        this.light.setDefault(data)
    }

    updateSettings(data) {
        this.store.setAll(data)
        this.settings = data
        this.light.setDefault(data.defaultCol)
        this.light.clear()
    }

    getSettings() {
        return this.settings
    }

    parseEvents(events) {
        if (events.length > this.eventCount) {
            for (let i = this.eventCount; i < events.length; i++) {
                if (events[i].EventName === 'FirstBlood') {
                    if (events[i].KillerName === this.currentName) {
                        this.light.firstBlood()
                    }
                } else if (events[i].EventName === 'ChampionKill') {
                    if (events[i].KillerName === this.currentName) {
                        this.light.championKill()
                    }
                }
            }
        }
        this.eventCount = events.length
    }

    parseScore(score) {
        if(((score - this.lastCreepScore)  > 3) & ((score - this.lastCreepScore)  < 60)) {
            //this.light.minionKill()
        }
        this.lastCreepScore = score
    }

    getConnections() {
        let connections ={
            wled: false,
            openRGBToWled: false,
            openRGB: false
        }
        if(this.settings.wled) {
            connections.wled = this.light.connected
            if(this.settings.openRGB) {
                connections.openRGBToWled = this.rgb.wledConnection
                connections.openRGB = this.rgb.connected
            } else {
                connections.openRGB = false
                connections.openRGBToWled = false
            }
        }else if(this.settings.openRGB) {
            connections.openRGB = this.light.connected
            connections.wled = false
            connections.openRGBToWled = false
        }

        this.emit('connection', connections)

    }
}

module.exports = Poll