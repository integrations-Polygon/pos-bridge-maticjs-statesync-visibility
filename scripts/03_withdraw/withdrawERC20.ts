import getMaticClient from "../../utils/setupMaticjsClient";
import config from "../../utils/config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawERC20 = async () => {
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW ERC20 TOKEN ON ROOT (BURN ON CHILD)");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const amount = prompt(`Enter amount to withdraw: `);
    if (amount < 0 || !amount) return console.log("Invalid amount");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
        SETUP MATIC CLIENT
    */
    const posClient = await getMaticClient();
    let erc20ChildToken = await posClient.erc20(config.erc20ChildToken);

    /* ---------------- BURN THE BATCH ERC20 ON CHILD ----------------- */

    /*
        USING MATICJS SDK BURN BATCH ERC20
    */
    const withdrawStart_response = await erc20ChildToken.withdrawStart(amount, {
        from: config.user,
    });

    console.log("Transaction Hash: ", await withdrawStart_response.getTransactionHash());
    console.log(
        `Transaction Details: https://mumbai.polygonscan.com/${await withdrawStart_response.getTransactionHash()}`
    );
    console.log(`\nToken burned successfully on child chain.`);
};

withdrawERC20()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
