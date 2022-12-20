import sleep from "./utils/sleep";
import getMaticClient from "./utils/setupMaticjsClient";
import config from "./utils/config";
import ps from "prompt-sync";
const prompt = ps();
const withdrawERC721 = async () => {

        let tokenIds: any = [];
        console.log("\n-----------------------------------------");
        console.log("WITHDRAW ERC721 TOKEN");
        console.log("-----------------------------------------\n");

        /* ---------------------------- INPUT ------------------------------ */

        const totalArgs = prompt("Enter the total number of tokenIds to batch withdrawl: ");
        if (!totalArgs) return console.log("Total number of argument cannot be null");
        if (totalArgs !== 0) {
            for (let i = 0; i < totalArgs; i++) {
                tokenIds[i] = prompt(`Enter your tokenId one by one [${i + 1}]: `);
                if (tokenIds[i] < 0) return console.log("Invalid tokenIds");
            }
        }

        /* ---------------------------- SETUP ------------------------------ */

        /* 
            SETUP MATIC CLIENT
        */
        const posClient = await getMaticClient();

        let erc721ChildToken = await posClient.erc721(config.childToken);

        const result = await erc721ChildToken.withdrawStartMany(tokenIds, {
            // nonce: 11793,
            // returnTransaction: true,
            gasPrice: '4000000000',
          })
        
          console.log(result);
        
          const txHash = await result.getTransactionHash();
          console.log("txHash", txHash);
          const receipt = await result.getReceipt();
          console.log("receipt", receipt);

       
     
        
};

withdrawERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
