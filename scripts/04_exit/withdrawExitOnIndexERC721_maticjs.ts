import getMaticClient from "../../utils/setupMaticjsClient";
import config from "../../utils/config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawExitOnIndexERC721 = async () => {
    // Empty array to store user input arguments
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW EXIT (UNLOCK) ERC721 BATCH TOKENS ON ROOT");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */
    const totalArgs = prompt("Enter the total number of tokenIds to batch exit: ");
    if (!totalArgs) return console.log("Total number of argument cannot be null");
    const burnHash = prompt("Enter Transaction hash of burn tokens: ");
    if (!burnHash) return console.log("Burn transaction Hash cannot be null");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
        SETUP MATIC CLIENT
    */
    const posClient = await getMaticClient();
    let erc721RootToken = await posClient.erc721(config.erc721RootToken, true);

    /* ----------------------- SUBMIT BURN PROOF ------------------------- */

    /*
        USING MATICJS SUBMIT BURN TXN HASH PROOF
    */
    for (let i = 0; i < totalArgs; i++) {
        const withdrawExitOnIndex_response = await erc721RootToken.withdrawExitOnIndex(burnHash, i);

        console.log("Transaction Hash: ", await withdrawExitOnIndex_response.getTransactionHash());
        console.log(
            `Transaction Details: https://goerli.etherscan.io/tx/${await withdrawExitOnIndex_response.getTransactionHash()}`
        );
    }
    console.log("\nTokens successfully unlocked on Root chain.");
};

withdrawExitOnIndexERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
