import { fetchGasPrice } from "../../utils/fetchGasPrice";
import fetchAbiData from "../../utils/fetchAbiData";
import { getErc721ChildToken, getUser } from "../../config";
import { ethers } from "ethers";
import dotenv from "dotenv";
import ps from "prompt-sync";
const prompt = ps();
dotenv.config();

const pKey: any = process.env.PRIVATE_KEY_POLYGON;
const projectID = process.env.INFURA_POLYGON_PROJECT_ID;

const withdrawbatch_contract = async () => {
    try {
        // Empty array to store user input arguments
        let tokenIds: any = [];
        console.log("\n-----------------------------------------");
        console.log("BRIDGE ERC721 TOKEN PROCESS");
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
        const provider = new ethers.providers.InfuraProvider("maticmum", projectID);

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
        const erc721ChildTokenAddress = getErc721ChildToken();
        const erc721ChildTokenABIData_response = await fetchAbiData(erc721ChildTokenAddress);
        const erc721ChildTokenManagerABI = erc721ChildTokenABIData_response.result;
        /* 
            INITIATE INTERFACE
        */
        const iface = new ethers.utils.Interface(erc721ChildTokenManagerABI);

        /* 
            INITIALIZE ROOT CHAIN MAMANGER INSTANCE 
        */
        const childTokenInstance = new ethers.Contract(
            erc721ChildTokenAddress,
            erc721ChildTokenManagerABI,
            provider
        );
        const childTokenManager = childTokenInstance.connect(signer);

        const estimatedGasLimit = await provider.estimateGas({
            type: 2,
            to: erc721ChildTokenAddress,
            from: getUser(),
            nonce: nonce,
            gasLimit: 14_999_999,
            maxPriorityFeePerGas: maxPriorityFee,
            maxFeePerGas: maxFee,
            data: iface.encodeFunctionData("withdrawBatch", [tokenIds]),
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
        console.log(`\nToken burned successfully on child chain.`);
    } catch (e) {
        console.log(e);
    }
};

withdrawbatch_contract()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("error", error);
        process.exit(1);
    });
