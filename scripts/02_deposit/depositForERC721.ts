import fetchAbiData from "../../utils/fetchAbiData";
import { getStateId } from "../../utils/getStateId";
import config from "../../utils/config";
import { ethers } from "ethers";
import dotenv from "dotenv";
import ps from "prompt-sync";
const prompt = ps();
dotenv.config();

const pKey: any = process.env.PRIVATE_KEY_GOERLI;
const projectID = process.env.INFURA_GOERLI_PROJECT_ID;

const despositForERC721 = async () => {
    try {
        // Empty array to store user input arguments
        let tokenIds: any = [];
        console.log("\n-----------------------------------------");
        console.log("BRIDGE ERC721 TOKEN WITH METADATA PROCESS");
        console.log("-----------------------------------------\n");
        /* ---------------------------- INPUT ------------------------------ */

        const totalArgs = prompt("Enter the total number of tokenIds to batch deposit: ");
        if (!totalArgs) return console.log("Total number of argument cannot be null");
        if (totalArgs !== 0) {
            for (let i = 0; i < totalArgs; i++) {
                tokenIds[i] = prompt(`Enter your tokenId one by one [${i + 1}]: `);
                if (tokenIds[i] < 0) return console.log("Invalid tokenID");
            }
        }

        /* ---------------------------- SETUP ------------------------------ */

        /* 
            USING INFURA PROVIDER
        */
        const provider = new ethers.providers.InfuraProvider("goerli", projectID);

        /* 
            INITIALIZE SIGNER 
        */
        const signer = new ethers.Wallet(pKey, provider);

        /* ---------------------------- APPROVE ---------------------------- */

        /* 
            FETCH ROOT CHAIN MANAGER ABI DATA FROM THE EXPLORER
        */
        const erc721RootTokenAddress = config.erc721RootToken;
        const erc721RootTokenABIData_response = await fetchAbiData(erc721RootTokenAddress);
        const erc721RootTokenABI = erc721RootTokenABIData_response.result;

        /* 
            INITIALIZE ROOT TOKEN INSTANCE AND CONNECT WITH SIGNER
        */
        const erc721RootTokenInstance = new ethers.Contract(
            erc721RootTokenAddress,
            erc721RootTokenABI,
            provider
        );
        const erc721RootToken = erc721RootTokenInstance.connect(signer);

        /* 
            APPROVE ERC721 PREDICATE CONTRACT 
        */
        console.log("\n-----------------------------------------");
        console.log("APPROVE - ERC721 PREDICATE PROXY CONTRACT");
        console.log("-----------------------------------------\n");
        for (let i = 0; i < totalArgs; i++) {
            let approveResponse = await erc721RootToken.approve(config.ERC721PredicateProxy, tokenIds[i]);
            await approveResponse.wait(1); // wait for 1 block confirmation
            console.log(`Approve transaction hash for tokenId ${tokenIds[i]}: `, approveResponse.hash);
            console.log(`Transaction details: https://goerli.etherscan.io/tx/${approveResponse.hash}`);
        }
        console.log("\nTokens Approved successfully");

        /* ---------------------------- DEPOSIT ---------------------------- */

        /* 
            FETCH ROOT CHAIN MANAGER ABI DATA FROM THE EXPLORER
        */
        const rootChainManagerAddress = config.rootChainManager;
        const rootChainManagerABIData_response = await fetchAbiData(rootChainManagerAddress);

        const rootChainManagerABI = rootChainManagerABIData_response.result;

        /* 
            INITIALIZE ROOT CHAIN MAMANGER INSTANCE 
        */
        const rootChainManagerInstance = new ethers.Contract(
            rootChainManagerAddress,
            rootChainManagerABI,
            provider
        );
        const rootChainManager = rootChainManagerInstance.connect(signer);

        /* 
            ENCODE DEPOSITDATA
        */
        const abiCoder = ethers.utils.defaultAbiCoder;
        const depositData = abiCoder.encode(["uint256[]"], [tokenIds]);

        /* 
            DEPOSIT ROOT TOKEN THROUGH ROOT CHAIN MANAGER
        */
        console.log("\n-----------------------------------------");
        console.log("DEPOSIT - ROOTCHAINMANAGER PROXY CONTRACT");
        console.log("-----------------------------------------\n");

        const rootChainManagerProxy = rootChainManager.attach(config.rootChainManagerProxy);

        const depositFor_response = await rootChainManagerProxy.depositFor(
            config.user,
            config.erc721RootToken,
            depositData
        );
        await depositFor_response.wait(1);

        const transactionHash: string = depositFor_response.hash;
        const stateId: number = await getStateId(transactionHash);

        console.log(`stateId: ${stateId}`);
        console.log("Deposit transaction hash: ", transactionHash);
        console.log(`Transaction details: https://goerli.etherscan.io/tx/${depositFor_response.hash}`);
        console.log(`\nToken Deposited successfully to ERC721Predicate Contract`);
    } catch (error) {
        console.log("Error in despositForERC721", error);
        process.exit(1);
    }
};

despositForERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("error", error);
        process.exit(1);
    });
