import { ethers } from "ethers";
import sleep from "./utils/sleep";
import getMaticClient from "./utils/setupMaticjsClient";
import config from "./utils/config";
import ps from "prompt-sync";
const prompt = ps();
const depositERC721 = async () => {
    console.log("\n-----------------------------------------");
    console.log("BRIDGE ERC721 TOKEN WITH METADATA PROCESS");
    console.log("-----------------------------------------\n");

    /* ----------------- INPUT ------------------ */

    const tokenID: any = prompt("Enter the tokenID to bridge: ");
    if (!tokenID) return console.log("tokenID cannot be null");
    if (tokenID < 0) return console.log("Invalid tokenID");

    const tokenUri = prompt("Enter the tokenUri: ");
    if (!tokenUri) return console.log("tokenUri cannot be null");

    /* ------------------------------------------ */

    // SETUP MATIC CLIENT
    const posClient = await getMaticClient();
    let erc721RootToken = await posClient.erc721(config.rootToken, true);

    // APPROVE NFT
    console.log("\n-----------------------------------------");
    console.log("APPROVE - ERC721 PREDICATE PROXY CONTRACT");
    console.log("-----------------------------------------\n");
    const approveResponse = await erc721RootToken.approve(tokenID);
    console.log("Approve transaction hash: ", await approveResponse.getTransactionHash());
    console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await approveResponse.getTransactionHash()}`
    );
    console.log("\nToken Approved successfully");

    // WAIT PERIOD
    console.log("\n-----------------------------------------");
    console.log("WAITING PERIOD - WAIT FOR AT LEAST 60 SEC");
    console.log("-----------------------------------------\n");
    console.log("Waiting at least 60 sec...");
    await sleep(60000); // wait at least 1 min for state change in goerli

    // ENCODE DATA
    const abiCoder = ethers.utils.defaultAbiCoder;
    const depositData = abiCoder.encode(["uint"], [tokenID]);

    // DEPOSIT NFT
    console.log("\n-----------------------------------------");
    console.log("DEPOSIT - ROOTCHAINMANAGER PROXY CONTRACT");
    console.log("-----------------------------------------\n");
    let depositResponse = await erc721RootToken.deposit(tokenID, config.user, { data: depositData });
    console.log("Deposit transaction hash: ", await depositResponse.getTransactionHash());
    console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await depositResponse.getTransactionHash()}`
    );
    console.log(`\nToken Deposited successfully to ERC721Predicate Contract`);
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
