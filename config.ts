import { config } from "dotenv";
config();

export const getPublicKey = () => {
    const publicKey = process.env.PUBLIC_KEY;

    if (!publicKey) {
        throw new Error("PUBLIC_KEY environment variable is not set.");
    }

    return publicKey;
};

export const getPrivateKeyPolygon = () => {
    const privateKeyPolygon = process.env.PRIVATE_KEY_POLYGON;

    if (!privateKeyPolygon) {
        throw new Error("PRIVATE_KEY_POLYGON environment variable is not set.");
    }

    return privateKeyPolygon;
};

export const getPrivateKeyEthereum = () => {
    const privateKeyEthereum = process.env.PRIVATE_KEY_ETHEREUM;

    if (!privateKeyEthereum) {
        throw new Error("PRIVATE_KEY_ETHEREUM environment variable is not set.");
    }

    return privateKeyEthereum;
};

export const getInfuraEthereumProjectId = () => {
    const infuraEthereumProjectId = process.env.INFURA_ETHEREUM_PROJECT_ID;

    if (!infuraEthereumProjectId) {
        throw new Error("INFURA_ETHEREUM_PROJECT_ID environment variable is not set.");
    }

    return infuraEthereumProjectId;
};

export const getInfuraPolygonProjectId = () => {
    const infuraPolygonProjectId = process.env.INFURA_POLYGON_PROJECT_ID;

    if (!infuraPolygonProjectId) {
        throw new Error("INFURA_POLYGON_PROJECT_ID environment variable is not set.");
    }

    return infuraPolygonProjectId;
};

export const getPolygonExplorerApiKey = () => {
    const polygonExplorerApiKey = process.env.POLYGON_EXPLORER_API_KEY;

    if (!polygonExplorerApiKey) {
        throw new Error("POLYGON_EXPLORER_API_KEY environment variable is not set.");
    }

    return polygonExplorerApiKey;
};

export const getEthereumExplorerApiKey = () => {
    const ethereumExplorerApiKey = process.env.ETHEREUM_EXPLORER_API_KEY;

    if (!ethereumExplorerApiKey) {
        throw new Error("ETHEREUM_EXPLORER_API_KEY environment variable is not set.");
    }

    return ethereumExplorerApiKey;
};

export const getDepositor = () => {
    const depositor = process.env.DEPOSITOR;

    if (!depositor) {
        throw new Error("DEPOSITOR environment variable is not set.");
    }

    return depositor;
};

export const getUser = () => {
    const user = process.env.USER;

    if (!user) {
        throw new Error("USER environment variable is not set.");
    }

    return user;
};

export const getErc20RootToken = () => {
    const erc20RootToken = process.env.ERC20ROOTTOKEN;

    if (!erc20RootToken) {
        throw new Error("ERC20ROOTTOKEN environment variable is not set.");
    }

    return erc20RootToken;
};

export const getErc20ChildToken = () => {
    const erc20ChildToken = process.env.ERC20CHILDTOKEN;

    if (!erc20ChildToken) {
        throw new Error("ERC20CHILDTOKEN environment variable is not set.");
    }

    return erc20ChildToken;
};

export const getErc721RootToken = () => {
    const erc721RootToken = process.env.ERC721ROOTTOKEN;

    if (!erc721RootToken) {
        throw new Error("ERC721ROOTTOKEN environment variable is not set.");
    }

    return erc721RootToken;
};

export const getErc721ChildToken = () => {
    const erc721ChildToken = process.env.ERC721CHILDTOKEN;

    if (!erc721ChildToken) {
        throw new Error("ERC721CHILDTOKEN environment variable is not set.");
    }

    return erc721ChildToken;
};

export const getRootChainManagerProxy = () => {
    const rootChainManagerProxy = process.env.ROOTCHAINMANAGERPROXY;

    if (!rootChainManagerProxy) {
        throw new Error("ROOTCHAINMANAGERPROXY environment variable is not set.");
    }

    return rootChainManagerProxy;
};

export const getRootChainManager = () => {
    const rootChainManager = process.env.ROOTCHAINMANAGER;

    if (!rootChainManager) {
        throw new Error("ROOTCHAINMANAGER environment variable is not set.");
    }

    return rootChainManager;
};

export const getChildChainManagerProxy = () => {
    const childChainManagerProxy = process.env.CHILDCHAINMANAGERPROXY;

    if (!childChainManagerProxy) {
        throw new Error("CHILDCHAINMANAGERPROXY environment variable is not set.");
    }

    return childChainManagerProxy;
};

export const getErc721PredicateProxy = () => {
    const erc721PredicateProxy = process.env.ERC721PREDICATEPROXY;

    if (!erc721PredicateProxy) {
        throw new Error("ERC721PREDICATEPROXY environment variable is not set.");
    }

    return erc721PredicateProxy;
};

export const getStateReceiver = () => {
    const stateReceiver = process.env.STATERECEIVER;

    if (!stateReceiver) {
        throw new Error("STATERECEIVER environment variable is not set.");
    }

    return stateReceiver;
};
