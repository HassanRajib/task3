
const crypto = require('crypto');

class FairPlay {
    constructor() {
        this.secretKey = crypto.randomBytes(32).toString('hex');
    }

    generateFairNumber(range) {
        const computerNumber = crypto.randomInt(0, range);
        const hmac = crypto.createHmac('sha3-256', this.secretKey).update(computerNumber.toString()).digest('hex');
        return { computerNumber, hmac };
    }

    verifyFairness(computerNumber, hmac) {
        const computedHmac = crypto.createHmac('sha3-256', this.secretKey).update(computerNumber.toString()).digest('hex');
        return computedHmac === hmac;
    }
}

module.exports = FairPlay;
