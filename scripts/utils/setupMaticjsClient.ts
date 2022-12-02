import dotenv from "dotenv";
import user from "./config";
import { POSClient, use } from "@maticnetwork/maticjs";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
use(Web3ClientPlugin);
dotenv.config();

const { PRIVATE_KEY_GOERLI, PRIVATE_KEY_POLYGON, INFURA_GOERLI_PROJECT_ID, INFURA_POLYGON_PROJECT_ID }: any =
    process.env;

let posClient: any = null;

const getMaticClient = async () => {
    posClient = new POSClient();

    await posClient.init({
        network: "testnet", // 'testnet' or 'mainnet'
        version: "mumbai", // 'mumbai' or 'v1'
        parent: {
            provider: new HDWalletProvider(
                PRIVATE_KEY_GOERLI,
                `https://goerli.infura.io/v3/${INFURA_GOERLI_PROJECT_ID}`
            ),
            defaultConfig: {
                from: user,
            },
        },
        child: {
            provider: new HDWalletProvider(
                PRIVATE_KEY_POLYGON,
                `https://polygon-mumbai.infura.io/v3/${INFURA_POLYGON_PROJECT_ID}`
            ),
            defaultConfig: {
                from: user,
            },
        },
    });
    return posClient;
};

export default getMaticClient;
