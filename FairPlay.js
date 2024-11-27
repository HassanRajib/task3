const crypto = require('crypto');

class FairPlay {
    constructor() {
        this.secretKey = null;
    }

    // Generate a cryptographically secure key
    generateKey() {
        this.secretKey = crypto.randomBytes(32).toString('hex'); // 256-bit key
        return this.secretKey;
    }

    // Generate a secure random number and its HMAC
    generateFairNumber(range) {
        const randomNumber = crypto.randomInt(0, range);
        const hmac = crypto.createHmac('sha256', this.secretKey).update(String(randomNumber)).digest('hex');
        return { randomNumber, hmac };
    }

    // Verify the HMAC
    verifyFairness(randomNumber, hmac) {
        const calculatedHmac = crypto.createHmac('sha256', this.secretKey).update(String(randomNumber)).digest('hex');
        return calculatedHmac === hmac;
    }

    // Combine user and computer inputs
    getFinalNumber(userInput, computerInput, range) {
        return (userInput + computerInput) % range;
    }
}

module.exports = FairPlay;

