
const crypto = require('crypto');

class FairPlay {
    static generateFairNumber(range) {
        const key = crypto.randomBytes(32).toString('hex');
        const computerNumber = crypto.randomInt(0, range);
        const hmac = crypto.createHmac('sha3-256', key).update(computerNumber.toString()).digest('hex');

        return { computerNumber, key, hmac };
    }

    static verifyFairness(key, computerNumber, hmac) {
        const computedHmac = crypto.createHmac('sha3-256', key).update(computerNumber.toString()).digest('hex');
        return computedHmac === hmac;
    }
}

module.exports = FairPlay;
