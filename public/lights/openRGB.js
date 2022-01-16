const { Client, utils } = require("openrgb-sdk")
const axios = require("axios");
const https = require("https");
const ip = '192.168.0.204'
const ledClient = axios.create({
    baseURL: `http://${ip}/json/state`,
    httpsAgent: new https.Agent({rejectUnauthorized: false})
})



async function start () {
    const client = new Client("Example", 6742, "localhost")

    await client.connect()

    const controllerCount = await client.getControllerCount()

    let deviceList = []
    for (let deviceId = 0; deviceId < controllerCount; deviceId++) {
        deviceList.push(await client.getControllerData(deviceId))
        await client.updateMode(deviceId, 'Direct')
    }

    setInterval(() => {
        ledClient.get('').then((request) => {
            let brightness = request.data.bri / 255
            let r = request.data.seg[0].col[0][0] * brightness
            let g = request.data.seg[0].col[0][1] * brightness
            let b = request.data.seg[0].col[0][2] * brightness
            for(let i=1;i<deviceList.length;i++) {
                //console.log(deviceList[i].name, deviceList[i].leds.length, utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2]))
                let ledCount = deviceList[i].leds.length
                let colArray = new Array(ledCount).fill(utils.color(r, g, b), 0, ledCount)
                client.updateLeds(i, colArray)
            }
            client.updateLeds(0, [utils.color(r, g, b)])
            // client.updateLeds(1, [utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2])])
            // client.updateLeds(2, [utils.color(request.data.seg[0].col[0][0], request.data.seg[0].col[0][1], request.data.seg[0].col[0][2])])
        }).catch((error) => {
            console.log("can't connect to wled")
        })
    }, 110)
}

module.exports = start