const DiceParser = require('./DiceParser');
const FairPlay = require('./FairPlay');
const ProbabilityCalculator = require('./ProbabilityCalculator');
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
        const fairPlay = new FairPlay();

        // Fair dice selection
        console.log("\nDetermining who selects the dice first...");
        fairPlay.generateKey();
        const { randomNumber: computerRoll, hmac: selectionHmac } = fairPlay.generateFairNumber(2);
        console.log(`Computer HMAC for dice selection: ${selectionHmac}`);

        const userSelection = parseInt(await promptUser("Choose a number (0 or 1): "), 10);
        const selectionResult = fairPlay.getFinalNumber(userSelection, computerRoll, 2);

        console.log(`Computer's dice selection number: ${computerRoll}`);
        console.log(`Secret Key for verification: ${fairPlay.secretKey}`);
        console.log(`Fairness verified: ${fairPlay.verifyFairness(computerRoll, selectionHmac)}`);

        const userGoesFirst = selectionResult === 0;
        console.log(userGoesFirst ? "You will select dice first." : "Computer will select dice first.");

        // Dice selection
        let userDieIndex, computerDieIndex;
        if (userGoesFirst) {
            console.log("Available dice:");
            dice.forEach((_, i) => console.log(`${i + 1}: Die ${i + 1}`));
            userDieIndex = parseInt(await promptUser("Choose a die: "), 10) - 1;
            computerDieIndex = Math.floor(Math.random() * dice.length);
        } else {
            computerDieIndex = Math.floor(Math.random() * dice.length);
            console.log(`Computer selects Die ${computerDieIndex + 1}.`);
            console.log("Available dice:");
            dice.forEach((_, i) => console.log(`${i + 1}: Die ${i + 1}`));
            userDieIndex = parseInt(await promptUser("Choose a die: "), 10) - 1;
        }

        // Game rounds
        while (true) {
            console.log("\nMenu:");
            console.log("1. Play a round");
            console.log("2. View help");
            console.log("3. Exit");

            const choice = await promptUser("Choose an option: ");

            if (choice === "1") {
                console.log("Playing a round...");

                // Step 3.1: Computer's throw
                fairPlay.generateKey();
                const { randomNumber: computerThrow, hmac: throwHmac } = fairPlay.generateFairNumber(6);
                console.log(`Computer HMAC for the throw: ${throwHmac}`);

                const userThrow = parseInt(await promptUser("Choose a number (0-5): "), 10);
                const finalThrow = fairPlay.getFinalNumber(userThrow, computerThrow, 6);

                console.log(`Computer's throw: ${computerThrow}`);
                console.log(`Key: ${fairPlay.secretKey}`);
                console.log(`Fairness verified: ${fairPlay.verifyFairness(computerThrow, throwHmac)}`);

                // Step 3.2: Dice rolls
                const userRoll = dice[userDieIndex].roll();
                const computerRoll = dice[computerDieIndex].roll();
                console.log(`Computer rolled: ${computerRoll}`);
                console.log(`You rolled: ${userRoll}`);

                if (userRoll > computerRoll) {
                    console.log("You win this round!");
                } else if (userRoll < computerRoll) {
                    console.log("Computer wins this round!");
                } else {
                    console.log("It's a tie!");
                }
            } else if (choice === "2") {
                const probabilities = ProbabilityCalculator.calculateProbabilities(dice);
                ProbabilityCalculator.displayProbabilityTable(probabilities, dice);
            } else if (choice === "3") {
                console.log("Exiting the game. Goodbye!");
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
