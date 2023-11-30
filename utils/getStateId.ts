import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const projectID = process.env.INFURA_GOERLI_PROJECT_ID;

export const getStateId = async (transactionHash: string): Promise<number> => {
    try {
        /* 
            USING INFURA PROVIDER
        */
        const provider = new ethers.providers.InfuraProvider("goerli", projectID);
        const txReceipt = await provider.getTransactionReceipt(transactionHash);
        const topics = txReceipt.logs.map((l) => l.topics);

        const stateSyncLogs = topics.filter(
            (t) => t[0] == "0x103fed9db65eac19c4d870f49ab7520fe03b99f1838e5996caf47e9e43308392"
        );
        const stateId = stateSyncLogs[0][1];
        return parseInt(stateId, 16); // convert hex to int and return
    } catch (error) {
        console.log("Error in getStateId", error);
        process.exit(1);
    }
};
