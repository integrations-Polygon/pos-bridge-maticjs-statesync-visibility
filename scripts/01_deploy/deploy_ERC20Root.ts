import { ethers } from "hardhat";
import { RootERC20Token__factory } from "../../src/types";

async function deploy() {
    // get the contract to deploy
    const MyERC20Token = (await ethers.getContractFactory("rootERC20Token")) as RootERC20Token__factory;
    const myERC20Token = await MyERC20Token.deploy();
    console.log("\nDeploying ERC20 Token smart contract on Ethereum Goerli chain....");
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(20000);
    console.log("\nMyRootNFT smart contract deployed at: ", myERC20Token.address);
    console.log(`https://goerli.etherscan.io/address/${myERC20Token.address}/`);
}

deploy();
