import getMaticClient from "../../utils/setupMaticjsClient";
import config from "../../utils/config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawERC721 = async () => {
    let tokenIds: any = [];
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW ERC721 TOKEN ON ROOT (BURN ON CHILD)");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const totalArgs = prompt("Enter the total number of tokenIds to batch withdraw: ");

    if (!totalArgs) return console.log("Total number of argument cannot be null");

    if (totalArgs !== 0) {
        for (let i = 0; i < totalArgs; i++) {
            tokenIds[i] = prompt(`Enter your tokenId one by one [${i + 1}]: `);
            if (tokenIds[i] < 0) return console.log("Invalid tokenIds");
        }
    }

    /* ---------------------------- SETUP ------------------------------ */

    /* 
        SETUP MATIC CLIENT
    */
    const posClient = await getMaticClient();
    let erc721ChildToken = await posClient.erc721(config.childToken);

    /* ---------------- BURN THE BATCH ERC 721 ON CHILD ----------------- */

    /*
        USING MATICJS SDK BURN BATCH ERC721
    */
    const withdrawStartMany_response = await erc721ChildToken.withdrawStartMany(tokenIds);

    console.log("Transaction Hash: ", withdrawStartMany_response.hash);
    console.log(`Transaction Details: https://mumbai.polygonscan.com/${withdrawStartMany_response.hash}`);
    console.log(`\nToken burned successfully on child chain.`);
};

withdrawERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
