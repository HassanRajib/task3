
const Dice = require('./Dice');

class DiceParser {
    static parse(args) {
        if (args.length < 3) {
            throw new Error(
                'You must provide at least 3 dice configurations. Example: "2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3".'
            );
        }

        return args.map((arg, index) => {
            const values = arg
                .trim()
                .split(',')
                .map(Number);

            if (values.length !== 6 || values.some(isNaN)) {
                throw new Error(
                    `Dice configuration #${index + 1} is invalid: "${arg}". Each die must have exactly 6 integers.`
                );
            }

            return new Dice(values);
        });
    }
}

module.exports = DiceParser;
