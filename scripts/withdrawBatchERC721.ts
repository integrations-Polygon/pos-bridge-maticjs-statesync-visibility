import fetchAbiData from "./utils/fetchAbiData";
import config from "./utils/config";
import { ethers } from "ethers";
import { fetchGasPrice } from "./utils/fetchGasPrice";
import dotenv from "dotenv";
import ps from "prompt-sync";
const prompt = ps();
dotenv.config();

const pKey: any = process.env.PRIVATE_KEY_GOERLI;
const projectID = process.env.INFURA_GOERLI_PROJECT_ID;

const withdrawbatch_contract = async () => {
    try {
        // Empty array to store user input arguments
        let tokenIds: any = [];
        console.log("\n-----------------------------------------");
        console.log("BRIDGE ERC721 TOKEN WITH METADATA PROCESS");
        console.log("-----------------------------------------\n");
        /* ---------------------------- INPUT ------------------------------ */

        const totalArgs = prompt("Enter the total number of tokenIds to batch withdraw: ");
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
        const provider = new ethers.providers.InfuraProvider("polygon", projectID);

        /* 
            INITIALIZE SIGNER 
        */
        const signer = new ethers.Wallet(pKey, provider);
        const nonce = await provider.getTransactionCount(signer.address);

        // Fetch the latest gas price data from the polygon v2 gas station API
        const { maxFee, maxPriorityFee }: any = await fetchGasPrice();


        /* ---------------------------- BURN ---------------------------- */

        /* 
            FETCH CHILD CHAIN MANAGER ABI DATA FROM THE EXPLORER
        */
        const childTokenAddress = config.childToken;
        const childTokenABIData_response = await fetchAbiData(childTokenAddress);
        const childTokenABIData = await childTokenABIData_response.json();
        const childTokenManagerABI = childTokenABIData.result;

        /* 
            INITIALIZE ROOT CHAIN MAMANGER INSTANCE 
        */
        const childTokenInstance = new ethers.Contract(
            childTokenAddress,
            childTokenManagerABI,
            provider
        );
        const childTokenManager = childTokenInstance.connect(signer);

        /* --EstimateGas-- */
        const estimatedGasLimit = await childTokenManager.estimateGas.withdrawBatch(tokenIds, {
            gasLimit: 14_999_999,
            nonce: nonce,
            maxFeePerGas: maxFee,
            maxPriorityFeePerGas: maxPriorityFee,
        });

        /* --burn for all tokens ad save transaction Hash-- */
        const burn_response = await childTokenManager.withdrawBatch(tokenIds, {
            gasLimit: estimatedGasLimit,
            nonce: nonce,
            maxFeePerGas: maxFee,
            maxPriorityFeePerGas: maxPriorityFee,
        });
        await burn_response.wait(1);

        const burnTx = burn_response.hash;

        console.log("withdraw transaction hash: ", burnTx);
        console.log(`Transaction details: https://mumbai.polygonscan.com/tx/${burnTx}`);
        console.log(`\nToken burned successfully to child token Contract`);
    } catch (e) {
        console.log(e);

    }
}

withdrawbatch_contract()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("error", error);
        process.exit(1);
    });
