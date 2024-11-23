const crypto = require('crypto');

class FairPlay {
    constructor() {
        this.secretKey = null;
    }

    generateFairNumber(range) {
        this.secretKey = crypto.randomBytes(32).toString('hex');
        const computerNumber = crypto.randomInt(0, range);
        const hmac = crypto.createHmac('sha3-256', this.secretKey).update(computerNumber.toString()).digest('hex');
        return { computerNumber, hmac };
    }

    revealSecretKey() {
        return this.secretKey;
    }

    verifyFairness(computerNumber, hmac) {
        const computedHmac = crypto.createHmac('sha3-256', this.secretKey).update(computerNumber.toString()).digest('hex');
        return computedHmac === hmac;
    }
}

module.exports = FairPlay;
