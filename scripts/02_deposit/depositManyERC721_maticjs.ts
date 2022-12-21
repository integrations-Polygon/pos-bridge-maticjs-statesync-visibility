import sleep from "../../utils/sleep";
import getMaticClient from "../../utils/setupMaticjsClient";
import config from "../../utils/config";
import ps from "prompt-sync";
const prompt = ps();
const depositERC721 = async () => {
    try {
        // Empty array to store user input arguments
        let tokenIds: any = [];
        console.log("\n-----------------------------------------");
        console.log("BRIDGE ERC721 TOKEN WITH METADATA PROCESS");
        console.log("-----------------------------------------\n");

        /* ---------------------------- INPUT ------------------------------ */

        const totalArgs = prompt("Enter the total number of tokenIds to batch deposit: ");
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
        let erc721RootToken = await posClient.erc721(config.rootToken, true);

        /* ---------------------------- APPROVE ---------------------------- */

        /* 
            APPROVE ERC721 PREDICATE CONTRACT 
        */
        console.log("\n-----------------------------------------");
        console.log("APPROVE - ERC721 PREDICATE PROXY CONTRACT");
        console.log("-----------------------------------------\n");
        for (let i = 0; i < totalArgs; i++) {
            let approveResponse = await erc721RootToken.approve(tokenIds[i]);
            await sleep(20000); // wait at least 15 for state change in goerli
            console.log(
                `Approve transaction hash for tokenId ${tokenIds[i]}: `,
                await approveResponse.getTransactionHash()
            );
            console.log(
                `Transaction details: https://goerli.etherscan.io/tx/${await approveResponse.getTransactionHash()}`
            );
        }
        console.log("\nTokens Approved successfully");

        /* ---------------------------- DEPOSIT ---------------------------- */

        /* 
            DEPOSIT NFT
        */
        console.log("\n-----------------------------------------");
        console.log("DEPOSIT - ROOTCHAINMANAGER PROXY CONTRACT");
        console.log("-----------------------------------------\n");
        let depositResponse = await erc721RootToken.depositMany(tokenIds, config.user);
        console.log("Deposit transaction hash: ", await depositResponse.getTransactionHash());
        console.log(
            `Transaction details: https://goerli.etherscan.io/tx/${await depositResponse.getTransactionHash()}`
        );
        console.log(`\nToken Deposited successfully to ERC721Predicate Contract`);
    } catch (error) {
        console.log("Error in despositERC721: ", error);
    }
};

depositERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
