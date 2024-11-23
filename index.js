const DiceParser = require('./DiceParser');
const FairPlay = require('./FairPlay');
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

        // Main game loop
        while (true) {
            console.log("\nMenu:");
            console.log("1. Play a round");
            console.log("2. View help (probability table)");
            console.log("3. Exit");

            const choice = await promptUser("Choose an option: ");

            if (choice === "1") {
                // Computer selects a die if it goes first
                const computerDieIndex = Math.floor(Math.random() * dice.length);
                console.log(`Computer selects Die ${computerDieIndex + 1}.`);

                // User selects a die
                console.log("Available dice:");
                dice.forEach((_, i) => console.log(`${i + 1}: Die ${i + 1}`));
                const userDieIndex = parseInt(await promptUser("Choose a die: "), 10) - 1;

                // Computer generates a fair number and HMAC
                const { computerNumber, hmac } = fairPlay.generateFairNumber(6);
                console.log(`HMAC for computer's number: ${hmac}`);

                // User selects a number
                const userNumber = parseInt(await promptUser("Choose a number (0-5): "), 10);

                // Reveal computer's secret key and verify fairness
                const secretKey = fairPlay.revealSecretKey();
                console.log(`Computer's number: ${computerNumber}`);
                console.log(`Secret key: ${secretKey}`);
                console.log(`Fairness verified: ${fairPlay.verifyFairness(computerNumber, hmac)}`);

                // Calculate result
                const finalComputerRoll = dice[computerDieIndex].roll();
                const finalUserRoll = dice[userDieIndex].roll();
                console.log(`Computer rolled: ${finalComputerRoll}`);
                console.log(`You rolled: ${finalUserRoll}`);

                if (finalUserRoll > finalComputerRoll) {
                    console.log("You win this round!");
                } else if (finalUserRoll < finalComputerRoll) {
                    console.log("Computer wins this round!");
                } else {
                    console.log("It's a tie!");
                }
            } else if (choice === "2") {
                console.log("Help: Probability table feature is coming soon.");
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
