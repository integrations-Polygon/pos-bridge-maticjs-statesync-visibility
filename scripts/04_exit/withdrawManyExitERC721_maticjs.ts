import getMaticClient from "../../utils/setupMaticjsClient";
import config from "../../utils/config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawExitERC721 = async () => {
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW EXIT (UNLOCK) ERC721 BATCH TOKENS ON ROOT");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const burnHash = prompt("Enter Transaction hash of burn tokens ");
    if (!burnHash) return console.log("Burn transaction Hash cannot be null");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
        SETUP MATIC CLIENT
    */
    const posClient = await getMaticClient();
    let erc721RootToken = await posClient.erc721(config.rootToken, true);

    /* ----------------------- SUBMIT BURN PROOF ------------------------- */

    /*
        USING MATICJS SUBMIT BURN TXN HASH PROOF
    */
    const withdrawExitMany_response = await erc721RootToken.withdrawExitMany(burnHash);

    console.log("Transaction Hash: ", withdrawExitMany_response.hash);
    console.log(`Transaction Details: https://goerli.etherscan.io/tx/${withdrawExitMany_response.hash}`);
    console.log("\nTokens successfully unlocked on Root chain.");
};

withdrawExitERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
