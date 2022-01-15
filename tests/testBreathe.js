const axios = require('axios')
const https = require('https')
const rgb = require('./openrgb')
rgb.start()

let data = {
    "on": true,
    "bri": 255,
    "transition": 0,
    "ps": -1,
    "pl": -1,
    "ccnf": {
        "min": 1,
        "max": 5,
        "time": 12
    },
    "nl": {
        "on": false,
        "dur": 60,
        "fade": true,
        "mode": 1,
        "tbri": 0,
        "rem": -1
    },
    "udpn": {
        "send": false,
        "recv": true
    },
    "lor": 0,
    "mainseg": 0,
    "seg": [
        {
            "id": 0,
            "start": 0,
            "stop": 60,
            "len": 60,
            "grp": 1,
            "spc": 0,
            "on": true,
            "bri": 255,
            "col": [
                [
                    255,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0
                ]
            ],
            "fx": 0,
            "sx": 153,
            "ix": 255,
            "pal": 0,
            "sel": true,
            "rev": false,
            "mi": false
        }
    ]
}
let ip = '192.168.0.204'
let down = true
let ledClient = axios.create({
    baseURL: `http://${ip}/json/state`,
    httpsAgent: new https.Agent({rejectUnauthorized: false})
})
setTimeout(() => {
    setInterval(() => {
        console.log(data.seg[0].col[0])
        if(down) {
            data.seg[0].col[0][0] = data.seg[0].col[0][0] - 15
        } else {
            data.seg[0].col[0][0] = data.seg[0].col[0][0] + 15
        }

        if(data.seg[0].col[0][0] <= 80) {
            down = false
        } else if (data.seg[0].col[0][0] >= 240) {
            down = true
        }
        console.log(data.seg[0].col[0][0])
            const res = ledClient.post('', data);

        rgb.update(data)
    }, 100)
},2000)
