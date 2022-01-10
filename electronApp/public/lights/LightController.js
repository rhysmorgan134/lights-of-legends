const axios = require('axios')
const lightValues = require('./lights.json')
const https = require('https')
const lights = require("./lights.json");

class LightController {
    constructor(ip, lowHpTh, lowManaTh) {
        this.url = `http://${ip}/json/state`
        this.ledClient = axios.create({
            baseURL: `http://${ip}/json/state`,
            httpsAgent: new https.Agent({rejectUnauthorized: false})
        })
        this.lights = lightValues
        this.lowHpTh = lowHpTh
        this.lowManaTh = lowManaTh
        this.storedVal = {}
        this.notifQueue = []
    }

    lowHp(value) {
        let hp = 255 - ((value/this.lowHpTh) * 255)
        let data = this.lights.hpLow
        data.seg[0].sx = hp
        this._post(data)
    }

    lowMana(value) {
        let mana = (value/this.lowManaTh) * 255
        let data = this.lights.manaLow
        data.seg[0].sx = mana
        this._post(data)
    }

    firstBlood() {
        if(Object.keys(this.storedVal).length === 0) {
            this._getCurrent().then(() => {
                console.log("posting fb")
                this.execNotif(this.lights.megaStrobe, 1000)
            })
        }
    }

    championKill() {
        if(Object.keys(this.storedVal).length === 0) {
            this._getCurrent().then(() => {
                console.log("posting kill")
                this.execNotif(this.lights.strobe, 1000)
            })
        }
    }

    minionKill() {
        if(Object.keys(this.storedVal).length === 0) {
            this._getCurrent().then(() => {
                console.log("posting gold")
                this.execNotif(this.lights.gold, 500)
            })
        }
    }

    execNotif(data, timeout) {
        this._post(data)
        setTimeout(() => {
            this._returnLast()
        }, timeout)
    }

    _post(data) {
        //console.log("posting", data)
        const res = this.ledClient.post('', data);
    }

    _getCurrent() {
        return this.ledClient.get('').then((response) => {
            this.storedVal = response.data
        })
    }

    _returnLast() {
        this._post(this.storedVal)
        this.storedVal = {}
    }

    clear() {
        this._post(this.lights.clear)
    }
}

module.exports = LightController