import { fetchDeals } from "./scraper.js";
import { hasDeal, saveDeal } from "./data.js";

async function main() {
    const deals = await fetchDeals();

    const newDeals = deals.filter(deal => !hasDeal(deal.id));

    console.log("New deals:");
    console.log(newDeals);

    for (const deal of newDeals) {
        saveDeal(deal);
    }
}

main();