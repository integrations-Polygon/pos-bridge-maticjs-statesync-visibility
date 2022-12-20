import sleep from "./utils/sleep";
import getMaticClient from "./utils/setupMaticjsClient";
import config from "./utils/config";
import ps from "prompt-sync";
const prompt = ps();
const withdrawExitERC721 = async () => {


        const txhash = prompt("Enter Transaction hash of burn tokens ");

        const posClient = await getMaticClient();
        
        let erc721RootToken = await posClient.erc721(config.rootToken, true);

        const result = await erc721RootToken.withdrawExitMany(txhash);
        
          console.log(result);
        
          const txHash = await result.getTransactionHash();
          console.log("txHash", txHash);
          const receipt = await result.getReceipt();
          console.log("receipt", receipt);

       
     
        
};

withdrawExitERC721()
    .then(() => {
        console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("err", err);
        process.exit(1);
    });
