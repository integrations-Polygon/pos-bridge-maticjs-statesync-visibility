import { ethers } from "ethers";
import sleep from "./utils/sleep";
import getMaticClient from "./utils/setupMaticjsClient";
import config from "./utils/config";
import ps from "prompt-sync";
const prompt = ps();
const depositERC721 = async () => {
    /* ----------------- INPUT ------------------ */

    console.log("\n");
    const tokenID: any = prompt("Enter the Token ID to bridge: ");
    if (!tokenID) return console.log("Token ID cannot be null");
    if (tokenID < 0) return console.log("Invalid Token ID");

    const tokenUri = prompt("Enter the tokenUri: ");
    if (!tokenID) return console.log("Token ID cannot be null");

    /* ------------------------------------------ */

    // SETUP MATIC CLIENT
    const posClient = await getMaticClient();
    let erc721RootToken = await posClient.erc721(config.rootToken, true);

    // APPROVE NFT
    const approveResponse = await erc721RootToken.approve(tokenID);
    console.log("\nToken Approved successfully");
    console.log("Approve txn Hash: ", await approveResponse.getTransactionHash());

    // WAIT PERIOD
    console.log("\nWaiting at least 60secs for the for block confirmation...");
    await sleep(60000); // wait at least 1 min for state change in goerli

    // ENCODE DATA
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedData = abiCoder.encode(["uint", "address", "string"], [tokenID, config.user, tokenUri]);

    // DEPOSIT NFT
    let depositResponse = await erc721RootToken.deposit(tokenID, config.user, {
        data: encodedData,
    });
    console.log(`\nToken Deposited successfully to ERC721Predicate Contract`);
    console.log("Deposit tx hash: ", await depositResponse.getTransactionHash());
};

depositERC721()
    .then(() => {
        console.log("\nEnding process\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
