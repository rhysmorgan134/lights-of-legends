const request = require('request');
const axios = require('axios')
const url = 'https://127.0.0.1:2999/liveclientdata/allgamedata'
const eventsUrl = 'https://127.0.0.1:2999/liveclientdata/eventdata'
const playerUrl = 'https://127.0.0.1:2999/liveclientdata/activeplayername'
const playersUrl = 'https://127.0.0.1:2999/liveclientdata/playerlist'
const Player = require('./Player');
const player = new Player()
const lights = require('./lights.json')
const LightController = require('./LightController')
const light = new LightController('192.168.0.204', 0.4, 0.4)
const fs = require('fs')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
let eventCount = 0
let connected = false
let thisPlayer = false
let players = []
let rgb = require('./openRGB')
const { fork } = require("child_process");
rgb()
const poll = (url) => {
    //rgb()
    axios.get(url)
        .then((response) => {
            player.updateStats(response.data.activePlayer.championStats)
            if(connected == false) {
                axios.get(playerUrl)
                    .then((response) => {
                        thisPlayer = response.data
                        connected = true
                        light.clear()
                    }).catch(function (error) {
                    if (error.response) {
                        connected = false
                    } else if (error.request) {
                        connected = false
                    } else {
                        connected = false
                    }
                })
            }
        }).catch(function (error) {
        if (error.response) {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        } else if (error.request) {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        } else {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        }
    });
}

const pollEvents = (url) => {
    axios.get(url)
        .then((response) => {
            let events = response.data.Events
            console.log(events.length, eventCount)
            if(events.length > eventCount) {
                for (let i = eventCount; i < events.length; i++) {
                    console.log(events[i].EventName)
                    if (events[i].EventName === 'FirstBlood') {
                        console.log(thisPlayer)
                        if (events[i].KillerName === thisPlayer) {
                            light.firstBlood()
                        }
                    } else if (events[i].EventName === 'ChampionKill') {
                        if (events[i].KillerName === thisPlayer) {
                            light.championKill()
                        }
                    }
                }
            }
            eventCount = events.length
        }).catch(function (error) {
        if (error.response) {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        } else if (error.request) {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        } else {
            data = lights.hpOk
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
            const res = axios.post('http://192.168.0.204/json/state', data);
        }
    });
}

const getPlayers = (url) => {
    axios.get(url)
        .then((response) => {

        }).catch(function (error) {
        if (error.response) {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        } else if (error.request) {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        } else {
            eventCount = 0
            if(connected) {
                light.clear()
                connected = false
            }
        }
    })
}


player.on('hpActive', (data) => {
    console.log('active')
    light.lowHp(data)
})

player.on('hpClear', (data) => {
    console.log('clear')
    light.clear()
})

player.on('hpUpdate', (data) => {
    console.log('update')
    light.lowHp(data)
})

setInterval(()=> {
    poll(url)
}, 100)

setInterval(()=> {
    pollEvents(eventsUrl)
}, 100)