import config from "./config";
import { ethers } from "ethers";
import { abi } from "../artifacts/src/Mumbai/StateReceiver.sol/StateReceiver.json";
import dotenv from "dotenv";
dotenv.config();

import ps from "prompt-sync";
const prompt = ps();

const pKey: any = process.env.PRIVATE_KEY_POLYGON;
const projectID = process.env.INFURA_POLYGON_PROJECT_ID;

const getStateCommitted = async () => {
    try {
        console.log("\n-----------------------------------------");
        console.log("GET STATE COMMITTED EVENT STATUS FROM STATEID");
        console.log("-----------------------------------------\n");

        /* ---------------------------- INPUT ------------------------------ */

        const stateId = prompt(`Enter your stateId: `);
        if (!stateId || stateId < 0) return console.log("Invalid Input");

        /* ---------------------------- SETUP ------------------------------ */
        /* 
            USING INFURA PROVIDER
        */
        const provider = new ethers.providers.InfuraProvider("maticmum", projectID);

        /* 
            INITIALIZE SIGNER 
        */
        const signer = new ethers.Wallet(pKey, provider);

        /* 
            FETCH STATERECEIVER ADDRESS AND ABI DATA 
        */
        const stateReceiverAddress = config.stateReceiver;
        const stateReceiverABI = abi;

        /* 
            INITIALIZE STATERECEIVER INSTANCE AND CONNECT WITH SIGNER
        */
        const stateReceiverInstance = new ethers.Contract(stateReceiverAddress, stateReceiverABI, provider);
        const stateReceiver = stateReceiverInstance.connect(signer);

        /* ---------------------------- EVENT ------------------------------ */

        const eventFilter = stateReceiver.filters.StateCommitted(stateId, null); // query for your stateId even if success id true or false

        let stateCommitted: any;

        stateCommitted = await stateReceiver.queryFilter(eventFilter);

        // Checking if stateCommitted is defined and has the expected structure
        if (
            stateCommitted &&
            stateCommitted.length > 0 &&
            stateCommitted[0].args &&
            stateCommitted[0].args.length > 1 &&
            stateCommitted[0].args[1] === true
        ) {
            console.log(`\nstateCommitted: ${JSON.stringify(stateCommitted, null, 2)}`);
            console.log(`\nStateCommitted status for StateId[${stateId}]: ${stateCommitted[0].args[1]}`);
        } else console.log(`\nStateCommitted status for StateId[${stateId}]: false`);
    } catch (error) {
        console.log(`Error in stateCommitted: ${error}`);
        process.exit(1);
    }
};

getStateCommitted()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
