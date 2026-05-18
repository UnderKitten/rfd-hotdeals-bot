import { fetchDeals } from "./scraper.js";
import { hasDeal, saveDeal, deleteOldDeals } from "./data.js";

async function main() {
    deleteOldDeals();

    const deals = await fetchDeals();

    const newDeals = deals.filter(deal => !hasDeal(deal.id));

    console.log("New deals:");
    console.log(newDeals);

    for (const deal of newDeals) {
        saveDeal(deal);
    }
}

main();