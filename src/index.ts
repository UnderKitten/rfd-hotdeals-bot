import { fetchDeals } from "./scraper.js";
import { hasDeal, saveDeal, deleteOldDeals } from "./data.js";
import { notifyDeals } from "./discord.js";

async function main() {
    deleteOldDeals();

    const deals = await fetchDeals();

    const newDeals = deals.filter(deal => !hasDeal(deal.id));

    if (newDeals.length === 0) {
        console.log("No new deals.");
        return;
    }

    await notifyDeals(newDeals);

    for (const deal of newDeals) {
        saveDeal(deal);
    }

    console.log(`Sent ${newDeals.length} deal notifications.`);
}

main();