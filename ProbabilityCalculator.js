
class ProbabilityCalculator {
    static calculateWinningProbabilities(dice) {
        const probabilities = [];
        for (let i = 0; i < dice.length; i++) {
            const row = [];
            for (let j = 0; j < dice.length; j++) {
                row.push(this.getWinProbability(dice[i], dice[j]));
            }
            probabilities.push(row);
        }
        return probabilities;
    }

    static getWinProbability(dieA, dieB) {
        let wins = 0;
        let total = dieA.values.length * dieB.values.length;

        dieA.values.forEach((a) => {
            dieB.values.forEach((b) => {
                if (a > b) wins++;
            });
        });

        return (wins / total).toFixed(2);
    }
}

module.exports = ProbabilityCalculator;
