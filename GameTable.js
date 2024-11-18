
const ProbabilityCalculator = require('./ProbabilityCalculator');

class GameTable {
    static generate(dice) {
        const probabilities = ProbabilityCalculator.calculateWinningProbabilities(dice);
        const header = dice.map((_, i) => `Die ${i + 1}`).join(' | ');
        const rows = probabilities.map((row, i) => {
            const values = row.join('  |  ');
            return `Die ${i + 1} | ${values}`;
        });

        return `       | ${header}\n${'-'.repeat(40)}\n${rows.join('\n')}`;
    }
}

module.exports = GameTable;
