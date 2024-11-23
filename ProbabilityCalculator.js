class ProbabilityCalculator {
    static calculateProbabilities(dice) {
        const probabilities = [];

        for (let i = 0; i < dice.length; i++) {
            probabilities[i] = [];
            for (let j = 0; j < dice.length; j++) {
                if (i === j) {
                    probabilities[i][j] = 'N/A'; // Same dice comparison
                } else {
                    probabilities[i][j] = ProbabilityCalculator.getWinProbability(dice[i], dice[j]);
                }
            }
        }

        return probabilities;
    }

    static getWinProbability(die1, die2) {
        const sides1 = die1.values;
        const sides2 = die2.values;

        let wins = 0;
        let total = 0;

        for (let roll1 of sides1) {
            for (let roll2 of sides2) {
                total++;
                if (roll1 > roll2) {
                    wins++;
                }
            }
        }

        return (wins / total).toFixed(2); // Probability of die1 winning
    }

    static displayProbabilityTable(probabilities, dice) {
        console.log("\nProbability Table:");
        console.log("Dice\\Dice", ...dice.map((_, i) => `D${i + 1}`));

        for (let i = 0; i < probabilities.length; i++) {
            const row = probabilities[i].map((prob) => (prob === 'N/A' ? prob : `${prob * 100}%`));
            console.log(`D${i + 1}`, ...row);
        }
    }
}

module.exports = ProbabilityCalculator;
