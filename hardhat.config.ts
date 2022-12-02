import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.6.6",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_GOERLI_PROJECT_ID}`,
            gasPrice: "auto",
            accounts: process.env.PRIVATE_KEY_GOERLI !== undefined ? [process.env.PRIVATE_KEY_GOERLI] : [],
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_POLYGON_PROJECT_ID}`,
            gasPrice: "auto",
            accounts: process.env.PRIVATE_KEY_POLYGON !== undefined ? [process.env.PRIVATE_KEY_POLYGON] : [],
        },
    },
    paths: {
        sources: "src",
    },
    typechain: {
        outDir: "src/types",
        target: "ethers-v5",
    },
    etherscan: {
        apiKey: process.env.POLYGON_EXPLORER_API_KEY || "",
    },
};

export default config;
