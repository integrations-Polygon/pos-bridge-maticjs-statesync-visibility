import config from "./config";
import { ethers } from "ethers";
import { abi } from "../artifacts/src/Mumbai/StateReceiver.sol/StateReceiver.json";
import dotenv from "dotenv";
dotenv.config();

const pKey: any = process.env.PRIVATE_KEY_POLYGON;
const projectID = process.env.INFURA_POLYGON_PROJECT_ID;

const stateCommitted = async () => {
    try {
        /* 
            USING INFURA PROVIDER
        */
        const provider = new ethers.providers.InfuraProvider("maticmum", projectID);

        /* 
            INITIALIZE SIGNER 
        */
        const signer = new ethers.Wallet(pKey, provider);

        /* ---------------------------- STATERECEIVER ---------------------------- */

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
        //const contractInterface = new ethers.utils.Interface(stateReceiverABI);

        //console.log(stateReceiver);

        const stateId = "231008";

        const eventSignature = getEventSignature("StateSyncResult", stateReceiverABI);

        const eventFilter = stateReceiver.filters.StateSyncResult(stateId);

        // const eventFilter = {
        //     uint256: parseInt(stateId),
        //     topics: [ethers.utils.id(eventSignature)],
        // };

        // const eventFilter = {
        //     address: stateReceiverAddress,
        //     topics: [null, null, ethers.utils.hexZeroPad(ethers.BigNumber.from(stateId).toHexString(), 32)],
        // };

        const response = await stateReceiver.queryFilter(eventFilter);

        // stateReceiver.on("StateSyncResult", (counter, status, message) => {
        //     console.log(`counter: ${counter}`);
        //     console.log(`status: ${status}`);
        //     console.log(`message: ${message}`);
        // });
        console.log(`response: ${JSON.stringify(response)}`);

        //const result = await provider.getLogs(eventFilter);

        // const logs = await provider.getLogs(eventFilter);

        // logs.forEach((log, idx) => {
        //     const decodedLog = ethers.utils.defaultAbiCoder.decode(
        //         ["uint256", "uint256", "string"],
        //         log.data
        //     );

        //     console.log(`--------------- ${idx}`);
        //     console.log(`stateId:        ${decodedLog[0].toString()}`);
        //     console.log(`status:         ${decodedLog[1].toString()}`);
        //     console.log(`message:        ${decodedLog[2]}`);
        //     console.log(`--------------- `);
        // });

        // result.forEach((log, idx) => {
        //     const decodedLog = contractInterface.decodeEventLog("StateSyncResult", log.data, log.topics);
        //     console.log(`--------------- ${idx}`);
        //     console.log(`stateId:        ${decodedLog.counter.toString()}`);
        //     console.log(`status:        ${decodedLog.status.toString()}`);
        //     console.log(`message:        ${decodedLog.message.toString()}`);

        //     console.log(`--------------- `);
        // });

        //console.log(`\nresult: ${response}`);
    } catch (error) {
        console.log(`Error in stateCommitted: ${error}`);
        process.exit(1);
    }
};
const getEventSignature = (eventName, abi) => {
    const eventAbi = abi.find((entry) => entry.name === eventName);
    const types = eventAbi.inputs.map((input) => input.type);
    return `${eventName}(${types.join(",")})`;
};

stateCommitted();
