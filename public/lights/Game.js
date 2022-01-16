const axios = require("axios");
const fs = require("fs");
const lights = require("./lights.json");

class Game {
    constructor(lights) {
        this.lights = lights
        setInterval(() => {

        })
    }

    getEvents() {
        const pollEvents = (url) => {
            console.log(url)
            axios.get(url)
                .then((response) => {
                    fs.writeFileSync('events.json', JSON.stringify(response.data.Events))
                    console.log('data', response.data)
                }).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log('error response', error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    data = lights.hpOk
                    const res = axios.post('http://192.168.0.204/json/state', data);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log('error request', error.request);
                    data = lights.hpOk
                    const res = axios.post('http://192.168.0.204/json/state', data);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error2', error.message, error);
                    data = lights.hpOk
                    const res = axios.post('http://192.168.0.204/json/state', data);
                }
                console.log(error.config);
            });
        }
    }
}