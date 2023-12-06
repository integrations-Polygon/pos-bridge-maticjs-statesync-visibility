import { ChildERC20__factory } from "../../src/types";
import { getChildChainManagerProxy } from "../../config";
import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function deploy() {
    // get the contract to deploy
    const MyERC20Child = (await ethers.getContractFactory("ChildERC20")) as ChildERC20__factory;
    const myERC20Child = await MyERC20Child.deploy("ChildERC20", "CF", "12", getChildChainManagerProxy());
    console.log("\nDeploying Child ERC20 smart contract on Polygon Mumbai chain....");
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(20000);
    console.log("\nMyERC20Child smart contract deployed at: ", myERC20Child.address);
    console.log(`https://mumbai.polygonscan.com/address/${myERC20Child.address}/`);
}

deploy();
