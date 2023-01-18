import axios from "axios";
const explorerApiKey = process.env.POLYGON_EXPLORER_API_KEY;

// Function to fetch your smart contract ABI data
async function fetchAbiData(contractAddress: any) {
    try {
        return (
            await axios.get(
                `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${explorerApiKey}`
            )
        ).data;
    } catch (error) {
        console.log(`Error in fetchAbiData: ${error}`);
        process.exit(1);
    }
}

export default fetchAbiData;
