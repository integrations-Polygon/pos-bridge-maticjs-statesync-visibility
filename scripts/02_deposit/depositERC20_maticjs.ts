import sleep from "../../utils/sleep";
import getMaticClient from "../../utils/setupMaticjsClient";
import config from "../../utils/config";
import ps from "prompt-sync";
const prompt = ps();

const depositERC20 = async () => {
    try {
        console.log("\n-----------------------------------------");
        console.log("BRIDGE ERC20 TOKEN WITH METADATA PROCESS");
        console.log("-----------------------------------------\n");

        /* ---------------------------- INPUT ------------------------------ */

        const amount = prompt(`Enter the amount to deposit: `);
        if (!amount || amount < 0) return console.log("Invalid amount");

        /* ---------------------------- SETUP ------------------------------ */

        /* 
            SETUP MATIC CLIENT
        */
        const posClient = await getMaticClient();
        let rootToken = await posClient.erc20(config.erc20RootToken, true);

        /* ---------------------------- APPROVE ---------------------------- */

        /* 
            APPROVE ERC20 PREDICATE CONTRACT 
        */
        console.log("\n-----------------------------------------");
        console.log("APPROVE - ERC20 PREDICATE PROXY CONTRACT");
        console.log("-----------------------------------------\n");

        let approveResponse = await rootToken.approve(amount);
        await sleep(20000); // wait at least 15 for state change in goerli
        console.log(`Approve transaction hash: `, await approveResponse.getTransactionHash());
        console.log(
            `Transaction details: https://goerli.etherscan.io/tx/${await approveResponse.getTransactionHash()}`
        );

        console.log("\nTokens Approved successfully");

        /* ---------------------------- DEPOSIT ---------------------------- */

        /* 
            DEPOSIT NFT
        */
        console.log("\n-----------------------------------------");
        console.log("DEPOSIT - ROOTCHAINMANAGER PROXY CONTRACT");
        console.log("-----------------------------------------\n");
        let depositResponse = await rootToken.deposit(amount, config.user);
        console.log("Deposit transaction hash: ", await depositResponse.getTransactionHash());
        console.log(
            `Transaction details: https://goerli.etherscan.io/tx/${await depositResponse.getTransactionHash()}`
        );
        console.log(`\nToken Deposited successfully to ERC721Predicate Contract`);
    } catch (error) {
        console.log("Error in despositERC20: ", error);
    }
};

depositERC20()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
