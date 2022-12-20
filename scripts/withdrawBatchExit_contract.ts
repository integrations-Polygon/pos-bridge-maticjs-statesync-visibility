import sleep from "./utils/sleep";
import getMaticClient from "./utils/setupMaticjsClient";
import config from "./utils/config";
import { ethers } from "ethers";
import ps from "prompt-sync";
import fetchAbiData from "./utils/fetchAbiData";
const prompt = ps();
import dotenv from "dotenv";
dotenv.config();

const pKey: any = process.env.PRIVATE_KEY_GOERLI;
const projectID = process.env.INFURA_GOERLI_PROJECT_ID;

const withDrawBatchExit_contract = async () => {
    try {
        const burnTxHash = prompt(`Enter Burn TX hash: `);
        if (!burnTxHash) throw Error('you need provide burn TX hash');
        const client = await getMaticClient();
        const result = await client.isCheckPointed(burnTxHash);
        if (result) {
            /* ---------------------------- SETUP ------------------------------ */

            /* 
                USING INFURA PROVIDER
            */
            const provider = new ethers.providers.InfuraProvider("goerli", projectID);
            /* 
         INITIALIZE SIGNER 
     */
            const signer = new ethers.Wallet(pKey, provider);
            /* 
            
           FETCH ROOT CHAIN MANAGER ABI DATA FROM THE EXPLORER
       */
            const rootChainManagerAddress = config.rootChainManager;
            const rootChainManagerABIData_response = await fetchAbiData(rootChainManagerAddress);
            const rootChainManagerABIData = await rootChainManagerABIData_response.json();
            const rootChainManagerABI = rootChainManagerABIData.result;

            /* 
                INITIALIZE ROOT CHAIN MAMANGER INSTANCE 
            */
            const rootChainManagerInstance = new ethers.Contract(
                rootChainManagerAddress,
                rootChainManagerABI,
                provider
            );
            const rootChainManager = rootChainManagerInstance.connect(signer);

            const exitCalldata = await client
                .exitERC721(burnTxHash, { from : signer.address, encodeAbi: true })


        }
    } catch (e) {

    }
}