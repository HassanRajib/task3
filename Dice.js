
class Dice {
    constructor(values) {
        if (!Array.isArray(values) || values.length !== 6) {
            throw new Error("A die must have exactly 6 values.");
        }
        this.values = values;
    }

    roll() {
        const randomIndex = Math.floor(Math.random() * this.values.length);
        return this.values[randomIndex];
    }
}

module.exports = Dice;