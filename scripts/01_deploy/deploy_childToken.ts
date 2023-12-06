import { ChildNFT__factory } from "../../src/types";
import { getChildChainManagerProxy } from "../../config";
import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function deploy() {
    // get the contract to deploy
    const MyChildNFT = (await ethers.getContractFactory("ChildNFT")) as ChildNFT__factory;
    const myChildNFT = await MyChildNFT.deploy("ChildNFT", "CF", getChildChainManagerProxy());
    console.log("\nDeploying ChildNFT smart contract on Polygon Mumbai chain....");
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(20000);
    console.log("\nMyChildNFT smart contract deployed at: ", myChildNFT.address);
    console.log(`https://mumbai.polygonscan.com/address/${myChildNFT.address}/`);
}

deploy();
