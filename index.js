
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

        DiceParser.validateSpecialCases(dice);

        console.log("Welcome to the Dice Game!");

        const fairPlay = new FairPlay();

        // Determine who goes first
        console.log("Determining who goes first...");
        const { computerNumber, hmac } = fairPlay.generateFairNumber(2);
        console.log(`HMAC for fairness: ${hmac}`);
        const userChoice = parseInt(await promptUser("Choose a number (0 or 1): "), 10);
        const result = (userChoice + computerNumber) % 2;

        console.log(`Computer's number: ${computerNumber}`);
        console.log(`Key: ${fairPlay.secretKey}`);
        console.log(
            `Fairness verified: ${fairPlay.verifyFairness(computerNumber, hmac)}`
        );

        console.log(result === 0 ? "You go first!" : "Computer goes first!");

        // Main game loop
        while (true) {
            console.log("\nMenu:");
            console.log("1. Roll a die");
            console.log("2. View probabilities");
            console.log("3. Exit");

            const choice = await promptUser("Choose an option: ");
            if (choice === "1") {
                console.log("Available dice:");
                dice.forEach((_, i) => console.log(`${i + 1}: Die ${i + 1}`));

                const dieChoice = parseInt(await promptUser("Choose a die: "), 10) - 1;
                const userRoll = dice[dieChoice].roll();
                console.log(`You rolled: ${userRoll}`);

                const computerRoll = dice[Math.floor(Math.random() * dice.length)].roll();
                console.log(`Computer rolled: ${computerRoll}`);

                if (userRoll > computerRoll) {
                    console.log("You win this round!");
                } else if (userRoll < computerRoll) {
                    console.log("Computer wins this round!");
                } else {
                    console.log("It's a tie!");
                }
            } else if (choice === "2") {
                console.log(GameTable.generate(dice));
            } else if (choice === "3") {
                console.log("Exiting the game.");
                break;
            } else {
                console.log("Invalid option. Try again.");
            }
        }

        rl.close();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
