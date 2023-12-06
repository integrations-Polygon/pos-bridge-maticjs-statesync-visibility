import getMaticClient from "../../utils/setupMaticjsClient";
import { getErc20RootToken } from "../../config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawExitERC20 = async () => {
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW EXIT (UNLOCK) ERC20 BATCH TOKENS ON ROOT");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */
    const burnHash = prompt("Enter Transaction hash of burn tokens: ");
    if (!burnHash) return console.log("Burn transaction Hash cannot be null");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
        SETUP MATIC CLIENT
    */
    const posClient = await getMaticClient();
    let erc20RootToken = await posClient.erc20(getErc20RootToken(), true);

    /* ----------------------- SUBMIT BURN PROOF ------------------------- */

    /*
        USING MATICJS SUBMIT BURN TXN HASH PROOF
    */

    console.log("type of burn hash: ", typeof burnHash);

    const withdrawExit_response = await erc20RootToken.withdrawExit(burnHash);

    console.log("Transaction Hash: ", await withdrawExit_response.getTransactionHash());
    console.log(
        `Transaction Details: https://goerli.etherscan.io/tx/${await withdrawExit_response.getTransactionHash()}`
    );

    console.log("\nTokens successfully unlocked on Root chain.");
};

withdrawExitERC20()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
