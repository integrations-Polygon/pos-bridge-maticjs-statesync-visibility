import { ethers } from "ethers";
import sleep from "./util/sleep";
import getMaticClient from "./util/setupMaticjsClient.js";
import config from "./util/config.js";

const depositERC721 = async () => {
    const tokenID = 3;
    const tokenUri = "nice";
    // SETUP MATIC CLIENT
    const posClient = await getMaticClient();
    let erc721RootToken = await posClient.erc721(config.rootToken, true);

    // APPROVE NFT
    const approveResponse = await erc721RootToken.approve(tokenID.toString());
    console.log("\nToken Approved successfully");
    console.log("Approve txn Hash: ", await approveResponse.getTransactionHash());
    await sleep(60000); // wait at least 1 min for state change in goerli

    // ENCODE DATA
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedData = abiCoder.encode(["uint", "address", "string"], [tokenID, config.user, tokenUri]);

    // DEPOSIT NFT
    let depositResponse = await erc721RootToken.deposit(tokenID.toString(), config.user, {
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
