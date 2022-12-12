import { ethers } from "hardhat";
import { RootNFT__factory } from "../../src/types";

async function deploy() {
    // get the contract to deploy
    const MyRootNFT = (await ethers.getContractFactory("RootNFT")) as RootNFT__factory;
    const myRootNFT = await MyRootNFT.deploy();
    console.log("\nDeploying RootNFT smart contract on Ethereum Goerli chain....");
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(20000);
    console.log("\nMyRootNFT smart contract deployed at: ", myRootNFT.address);
    console.log(`https://goerli.etherscan.io/address/${myRootNFT.address}/`);
    console.log(myRootNFT);
}

deploy();
