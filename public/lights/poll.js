const EventEmitter = require('events')
const axios = require('axios')
const Player = require('./Player');
const LightController = require('./LightController')
const LightControllerRGB = require('./LightControllerRGB')
const settings = require("./settings.json")
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let rgb = require('./openRGB')

class Poll extends EventEmitter {
    constructor() {
        super()
        this.wledURL = settings.wledURL
        this.allDataUrl = 'https://127.0.0.1:2999/liveclientdata/allgamedata'
        this.eventsUrl = 'https://127.0.0.1:2999/liveclientdata/eventdata'
        this.playerUrl = 'https://127.0.0.1:2999/liveclientdata/activeplayername'
        this.playersUrl = 'https://127.0.0.1:2999/liveclientdata/playerlist'

        this.eventCount = 0
        this.connected = false
        this.players = []
        this.currentName = false
        this.playerOffset = null
        this.lastCreepScore = 0
        this.loaded = false
        console.log(settings.defaultCol)
        this.defaultCol = settings.defaultCol

        this.player = new Player()
        if(settings.wled) {
            this.light = new LightController('192.168.0.204', 0.4, 0.4, settings.wled, settings.openRGB, this.defaultCol)
            this.rgb = rgb()
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
            console.log('clear')
            this.light.clear()
        })

        this.player.on('hpUpdate', (data) => {
            console.log('update')
            this.light.lowHp(data)
        })

        setInterval(() => {
            if(this.connected) {
                this.emit('update', this.players)
            }
        }, 10000)

    }


    _poll() {
        axios.get(this.allDataUrl)
            .then((response) => {
                this.player.updateStats(response.data.activePlayer.championStats)
                console.log(this.connected)
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
                    console.log("clear")
                    this.light.clear()
                    this.connected = true
                    this.emit('gameLoaded', response.data.allPlayers)
                    console.log("connected")
                }
                if(this.connected) {
                    this.parseEvents(response.data.events.Events)
                    // console.log(response.data.allPlayers)
                    // this.parseScore(response.data.allPlayers[this.playerOffset].scores.creepScore)
                    this.parseScore(response.data.activePlayer.currentGold)
                    this.players = response.data.allPlayers
                }
            }).catch((error) => {
            if (error.response) {
                //console.log(error.response)
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

    parseEvents(events) {
        if (events.length > this.eventCount) {
            console.log(events[events.length -1])
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
            this.light.minionKill()
        }
        this.lastCreepScore = score
    }
}

module.exports = Poll