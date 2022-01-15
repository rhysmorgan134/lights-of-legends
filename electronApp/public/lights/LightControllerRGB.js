const axios = require('axios')
const lightValues = require('./lights.json')
const https = require('https')
const lights = require("./lights.json");
const { Client, utils } = require("openrgb-sdk")


class LightControllerRGB {
    constructor() {

        this.client = new Client("Example", 6742, "localhost")
        this.deviceList = []
        this.setup = false
        let deviceList = []
        this.storedVal = []

        this.red = [255,0,0]
        this.white = [255,255,255]
        this.off = [0,0,0]

        this.lights = lightValues
        this.notifQueue = []
    }


    async connect() {
        await this.client.connect()
        const controllerCount = await this.client.getControllerCount()
        for (let deviceId = 0; deviceId < controllerCount; deviceId++) {
            this.deviceList.push(await this.client.getControllerData(deviceId))
            await this.client.updateMode(deviceId, 'Direct')
        }

        this.setup= true
        this.clear()
    }
    lowHp(value) {
        this._post(this.red)
    }

    lowMana(value) {
        this._post(data)
    }

    firstBlood() {
        if(this.storedVal.length === 0) {
            this._getCurrent()
            this.strobe()
        }
    }

    championKill() {
        console.log("kill", this.storedVal)
        if(this.storedVal.length === 0) {
            this._getCurrent()
            this.strobe()
        }
    }

    minionKill() {
        // if(Object.keys(this.storedVal).length === 0) {
        //     this._getCurrent().then(() => {
        //         console.log("posting gold")
        //         // this.execNotif(this.lights.gold, 500)
        //     })
        // }
    }

    execNotif(timeout) {
        this._getCurrent()
        this.strobe()
        setTimeout(() => {
            this._returnLast()
        }, timeout)
    }

    strobe() {
        console.log("strobing")
        this._post(this.off)
        setTimeout(() => {
            console.log("strobe 1")
            this._post(this.white)
            setTimeout(() => {
                console.log("strobe 2")
                this._post(this.off)
                setTimeout(() => {
                    console.log("strobe 3")
                    this._post(this.white)
                    setTimeout(() => {
                        console.log("strobe 4")
                        this._post(this.off)
                        setTimeout(() => {
                            console.log("strobe 5")
                            this._post(this.white)
                            setTimeout(() => {
                                console.log("strobe 2")
                                this._post(this.off)
                                setTimeout(() => {
                                    console.log("strobe 3")
                                    this._post(this.white)
                                    setTimeout(() => {
                                        console.log("strobe 4")
                                        this._post(this.off)
                                        setTimeout(() => {
                                            console.log("strobe 5")
                                            this._returnLast()
                                        }, 100)
                                    }, 100)
                                }, 100)
                            }, 100)
                        }, 100)
                    }, 100)
                }, 100)
            }, 100)
        }, 100)
    }

    async _post(colour) {
        let r = colour[0]
        let g = colour[1]
        let b = colour[2]
        if(this.setup) {
            for(let i=0;i<this.deviceList.length;i++) {
                //console.log(deviceList[i].name, deviceList[i].leds.length, utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2]))
                let ledCount = this.deviceList[i].leds.length
                let colArray = new Array(ledCount).fill(utils.color(r, g, b), 0, ledCount)
                this.client.updateLeds(i, colArray)
            }
            console.log("updating: ", colour)
            //await this.client.updateLeds(0, [utils.color(r, g, b)])
            this.colour = colour
        }
    }

    _getCurrent() {
        this.storedVal = this.colour
    }

    _returnLast() {
        this._post(this.storedVal)
        this.storedVal = []
    }


    clear() {
        this._post(this.white)
    }
}

module.exports = LightControllerRGB