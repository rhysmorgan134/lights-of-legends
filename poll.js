const request = require('request');
const axios = require('axios')
const url = 'https://127.0.0.1:2999/liveclientdata/allgamedata'
const Player = require('./Player');
const player = new Player()
const lights = require('./lights.json')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const poll = (url) => {
    axios.get(url)
        .then((response) => {
            player.updateStats(response.data.activePlayer.championStats)
        })  .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
}

player.on('hpActive', (data) => {
    let hp = (data/0.4) * 255
    data = lights.hpLow
    data.seg[0].sx = hp
    console.log(data)
    const res = axios.post('http://192.168.0.204/json/state', data);
    console.log(res)
})

player.on('hpClear', (data) => {
    data = lights.hpOk
    const res = axios.post('http://192.168.0.204/json/state', data);
})

player.on('hpUpdate', (data) => {
    let hp = 255 - ((data/0.4) * 255)
    cont = lights.hp
    cont.seg[0].sx = hp
    console.log(hp)
    const res = axios.post('http://192.168.0.204/json/state', cont);
})

setInterval(()=> {
    poll(url)
}, 100)