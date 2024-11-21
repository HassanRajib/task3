
const Dice = require('./Dice');

class DiceParser {
    static parse(args) {
        if (args.length < 3) {
            throw new Error(
                'You must provide at least 3 dice configurations. Example: "2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7".'
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

    static validateSpecialCases(dice) {
        const isIdenticalDice = dice.every((die) =>
            JSON.stringify(die.values) === JSON.stringify([1, 2, 3, 4, 5, 6])
        );

        if (isIdenticalDice) {
            console.log('Special case: All dice are identical (1,2,3,4,5,6).');
        }

        const isThreeDifferentDice =
            dice.length === 3 &&
            JSON.stringify(dice[0].values) === JSON.stringify([2, 2, 4, 4, 9, 9]) &&
            JSON.stringify(dice[1].values) === JSON.stringify([1, 1, 6, 6, 8, 8]) &&
            JSON.stringify(dice[2].values) === JSON.stringify([3, 3, 5, 5, 7, 7]);

        if (isThreeDifferentDice) {
            console.log('Special case: Three specific dice configurations detected.');
        }
    }
}

module.exports = DiceParser;

