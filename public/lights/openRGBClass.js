const { Client, utils } = require("openrgb-sdk")
const axios = require("axios");
const https = require("https");

let connected = false;

class OpenRGB {
    constructor(ip) {
        this.ip = ip
        this.ledClient = axios.create({
            baseURL: `http://${ip}/json/state`,
            httpsAgent: new https.Agent({rejectUnauthorized: false})
        })
        this.connected = false
        this.client = new Client("Example", 6742, "localhost")
        this.controllerCount = 0
        this.wledConnection = false
        this.deviceList = []
        this.interval = null
        this.start().catch((error) => {
            console.log(error)
            this.notReady()
        })
    }

    sync() {
        this.ledClient.get('').then((request) => {
            let brightness = request.data.bri / 255
            let r = request.data.seg[0].col[0][0] * brightness
            let g = request.data.seg[0].col[0][1] * brightness
            let b = request.data.seg[0].col[0][2] * brightness
            for(let i=1;i<this.deviceList.length;i++) {
                //console.log(deviceList[i].name, deviceList[i].leds.length, utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2]))
                let ledCount = this.deviceList[i].leds.length
                let colArray = new Array(ledCount).fill(utils.color(r, g, b), 0, ledCount)
                this.client.updateLeds(i, colArray)
            }
            this.client.updateLeds(0, [utils.color(r, g, b)])
            this.wledConnection = true
            // client.updateLeds(1, [utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2])])
            // client.updateLeds(2, [utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2])])
        }).catch((error) => {
            console.log("can't connect to wled", error)
            this.wledConnection = false
        })
    }

    async start () {

        await this.client.connect()
        console.log("rgb connected")
        this.controllerCount = await this.client.getControllerCount()
        console.log('rgb controller count: ', this.controllerCount)
        this.connected = true
        for (let deviceId = 0; deviceId < this.controllerCount; deviceId++) {
            this.deviceList.push(await this.client.getControllerData(deviceId))
            await this.client.updateMode(deviceId, 'Direct')
        }

        this.ready()
    }

    ready() {
        this.interval = setInterval(() => {
            this.sync()
        }, 100)
    }

    notReady() {
        if(this.interval) {
            this.interval.clearInterval()
        }
        console.log("disconnected")
        setTimeout(() => {
            this.start().catch(() => {
                this.notReady()
            })
        }, 1000)
    }
}

module.exports = OpenRGB