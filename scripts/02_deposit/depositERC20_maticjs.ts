import getMaticClient from "../../utils/setupMaticjsClient";
import { getStateId } from "../../utils/getStateId";
import { getErc20RootToken, getUser } from "../../config";
import sleep from "../../utils/sleep";
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
        let erc20RootToken = await posClient.erc20(getErc20RootToken(), true);

        /* ---------------------------- APPROVE ---------------------------- */

        /* 
            APPROVE ERC20 PREDICATE CONTRACT 
        */
        console.log("\n-----------------------------------------");
        console.log("APPROVE - ERC20 PREDICATE PROXY CONTRACT");
        console.log("-----------------------------------------\n");

        let approveResponse = await erc20RootToken.approve(amount);
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
        let depositResponse = await erc20RootToken.deposit(amount, getUser());

        const transactionHash: string = await depositResponse.getTransactionHash();
        await sleep(20000);

        const stateId: number = await getStateId(transactionHash);

        console.log(`stateId: ${stateId}`);
        console.log("Deposit transaction hash: ", transactionHash);
        console.log(`Transaction details: https://goerli.etherscan.io/tx/${transactionHash}`);
        console.log(`\nToken Deposited successfully to ERC20Predicate Contract`);
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
