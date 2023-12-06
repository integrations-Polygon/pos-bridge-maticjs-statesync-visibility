# **pos-bridge-maticjs**

**pos-bridge-maticjs** repository is a comprehensive codebase that leverages Matic.js functionalities for seamless operations, including depositing, withdrawing, and exiting between Layer 1 (L1) and Layer 2 (L2) on the Proof-of-Stake (PoS) bridge. This repository not only facilitates the smooth transfer of assets but also encompasses essential code for ensuring transparent statesync visibility of your blocks and transactions.

## **Getting started**

- Clone this repository

```bash
git clone https://github.com/integrations-Polygon/pos-bridge-maticjs.git

```

- Navigate to `pos-bridge-maticjs`

```bash
cd pos-bridge-maticjs

```

- Install dependencies

```bash
npm install

```
or

```bash
yarn

```
- Create `.env` file

```bash
cp .env.example .env

```

- Configure environment variables in `.env`

```
PUBLIC_KEY =
PRIVATE_KEY_POLYGON =
PRIVATE_KEY_GOERLI =
INFURA_GOERLI_PROJECT_ID = 
INFURA_POLYGON_PROJECT_ID = 
POLYGON_EXPLORER_API_KEY =
ETHEREUM_EXPLORER_API_KEY = 

# CONFIG
DEPOSITOR = 
USER = 
ERC20ROOTTOKEN = 
ERC20CHILDTOKEN = 
ERC721ROOTTOKEN = 
ERC721CHILDTOKEN = 
ROOTCHAINMANAGERPROXY = 
process.env.ROOTCHAINMANAGER = 
process.env.CHILDCHAINMANAGERPROXY = 
ERC721PREDICATEPROXY = 
STATERECEIVER = 

```

## **Usage**

Firstly, you would need to **deploy** your tokens on both root and child (ignore if already done)

### **Deploy your smart contract**

To deploy your smart contract, first you would need to freshly **compile** your smart contract by simply running this command

```bash
npx hardhat clean

```
and

```bash
npx hardhat compile

```
After that, to actually **deploy** the smart contract run this command

```bash
npx hardhat run --network goerli ./scripts/01_deploy/deploy_rootToken.ts
npx hardhat run --network mumbai ./scripts/01_deploy/deploy_childToken.ts
npx hardhat run --network goerli ./scripts/01_deploy/deploy_ERC20Root.ts
npx hardhat run --network mumbai ./scripts/01_deploy/deploy_ERC20Child.ts

```

### **Verify your deployed smart contract (OPTIONAL)**

It is always a good practice to **verify** your smart contract for future debugging sessions by simple running this command

```bash
npx hardhat verify --network <network> <deploy-contract-address> <if-any-arguments-seperated-by-space>

```

### **Start the script**

- Start the **deposit ERC20 script using maticjs** by running this command

```bash
npx hardhat run ./scripts/02_deposit/depositERC20_maticjs.ts

```

- Start the **depositMany ERC721 script using maticjs** by running this command

```bash
npx hardhat run ./scripts/02_deposit/depositManyERC721_maticjs.ts

```

- Start the **depositFor ERC721 script without maticjs** by running this command

```bash
npx hardhat run ./scripts/02_deposit/depositForERC721.ts

```

After the deposit, you can fetch and store your StateId to query for stateSync visibility.

- Start the **getStateCommited script** by running this command
  
```bash
npx hardhat run ./utils/getStateCommitted.ts
```

- Start the **withdraw ERC20 script using maticjs** by running this command

```bash
npx hardhat run ./scripts/03_withdraw/withdrawERC20_maticjs.ts

```

- Start the **withdrawStartMany ERC721 script using maticjs** by running this command

```bash
npx hardhat run ./scripts/03_withdraw/withdrawStartManyERC721_maticjs.ts

```

- Start the **withdrawBatch ERC721 script without maticjs** by running this command

```bash
npx hardhat run ./scripts/03_withdraw/withdrawBatchERC721.ts

```

After withdrawing, you can fetch and store the burn address to check if it has checkpointed or not.

- Start the **isCheckpointed script** by running this command

```bash
npx hardhat run ./utils/isCheckpointed.ts

```

- Start the **withdrawExit ERC20 script with maticjs** by running this command

```bash
npx hardhat run ./scripts/04_exit/withdrawExitERC20_maticjs.ts

```

- Start the **withdrawExitOnIndex ERC721 script with maticjs** by running this command

```bash
npx hardhat run ./scripts/04_exit/withdrawExitOnIndexERC721_maticjs.ts

```

### **Contributing**:

If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. We welcome community contributions.