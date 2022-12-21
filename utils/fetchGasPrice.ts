import fetch from "node-fetch";

export async function fetchGasPrice() {
    try {
        const gasData:any = await fetch("https://gasstation-mumbai.matic.today/v2");

        // Get the maxFee and maxPriorityFee for fast
        const maxFeeInGWEI = gasData.fast.maxFee;
        const maxPriorityFeeInGWEI = gasData.fast.maxPriorityFee;

        /* Convert the fetched GWEI gas price to WEI after converting ignore the decimal value
         * as the transaction payload only accepts whole number
         */
        const maxFee = Math.trunc(maxFeeInGWEI * 10 ** 9);
        const maxPriorityFee = Math.trunc(maxPriorityFeeInGWEI * 10 ** 9);
        return { maxFee, maxPriorityFee };
    } catch (error) {
        console.log(`Error in fetchGasPrice: ${error}`);
        process.exit(1);
    }
}
