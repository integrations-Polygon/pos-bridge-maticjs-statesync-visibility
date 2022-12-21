import fetch from "node-fetch";
const explorerApiKey = process.env.ETHEREUM_EXPLORER_API_KEY;

// Function to fetch your smart contract ABI data
async function fetchAbiData(contractAddress: any) {
    try {
        return await fetch(
            `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${explorerApiKey}`
        );
    } catch (error) {
        console.log(`Error in fetchAbiData: ${error}`);
        process.exit(1);
    }
}

export default fetchAbiData;
