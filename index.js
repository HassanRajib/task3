
const DiceParser = require('./DiceParser');
const FairPlay = require('./FairPlay');
const GameTable = require('./GameTable');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function promptUser(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
    try {
        const args = process.argv.slice(2);
        const dice = DiceParser.parse(args);

        console.log("Welcome to the Dice Game!");

        // Decide first turn with provable fairness
        console.log("Determining who goes first...");
        const { computerNumber, key, hmac } = FairPlay.generateFairNumber(2);
        console.log(`HMAC for fairness: ${hmac}`);
        const userChoice = parseInt(await promptUser("Choose a number (0 or 1): "), 10);
        const result = (userChoice + computerNumber) % 2;

        console.log(`Computer's number: ${computerNumber}`);
        console.log(`Key: ${key}`);
        console.log(`Result: ${result === 0 ? 'User goes first!' : 'Computer goes first!'}`);

        // Main game loop
        while (true) {
            console.log("\nAvailable options:");
            console.log("1. Roll a die");
            console.log("2. View probabilities");
            console.log("3. Exit");

            const choice = await promptUser("Select an option: ");
            if (choice === '1') {
                console.log("Available dice:");
                dice.forEach((_, i) => console.log(`${i + 1}. Die ${i + 1}`));

                const dieChoice = parseInt(await promptUser("Choose a die: "), 10) - 1;
                const userRoll = dice[dieChoice].roll();
                console.log(`You rolled: ${userRoll}`);

                const computerRoll = dice[Math.floor(Math.random() * dice.length)].roll();
                console.log(`Computer rolled: ${computerRoll}`);

                if (userRoll > computerRoll) {
                    console.log("You win!");
                } else if (userRoll < computerRoll) {
                    console.log("Computer wins!");
                } else {
                    console.log("It's a tie!");
                }
            } else if (choice === '2') {
                console.log(GameTable.generate(dice));
            } else if (choice === '3') {
                console.log("Exiting the game.");
                break;
            } else {
                console.log("Invalid option. Please try again.");
            }
        }

        rl.close();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
