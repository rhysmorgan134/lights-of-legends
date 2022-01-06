const EventEmitter = require('events');

class Player extends EventEmitter {

    constructor() {
        super()
        this.currentHealth = 0;
        this.maxHealth =0;
        this.resourceType = 'MANA';
        this.resourceValue = 0;
        this.resourceMax = 0;
        this.hpPerc = 1
        this.resourcePerc = 1
        this.hpThreshold = 0.4
        this.resourceThreshold = 0.4
    }

    updateStats(data) {
        if (this.currentHealth != data.currentHealth, 2) {
            this.hpPerc = this.checkThreshold(data.currentHealth, data.maxHealth, this.hpPerc, this.hpThreshold, 'hp')
            this.currentHealth = data.currentHealth
            this.maxHealth = data.maxHealth
        }
        this.maxHealth = data.maxHealth
        this.resourceType = data.resourceType
        this.resourceValue = data.resourceValue
        this.resourceMax = data.resourceMax
        this.resourcePerc = this.resourceMax/this.resourceValue
    }

    checkThreshold(current, max, last, threshold, type) {
        let tempPerc = current/max
        if (last < threshold) {
            if(tempPerc >= threshold) {
                this.emit(type + 'Clear', tempPerc.toFixed(2))
            } else {
                this.emit(type + 'Update', tempPerc.toFixed(2))
            }
        } else {
            if (tempPerc < threshold) {
                this.emit(type + 'Active', tempPerc.toFixed(2))
            }
        }

        return tempPerc
    }

    checkValues() {
        if(hpPerc < 0.4) {

        }
    }
}

module.exports = Player