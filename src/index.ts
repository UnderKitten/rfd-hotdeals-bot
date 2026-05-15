import { fetchDeals } from "./scraper.js";

async function main() {
    const deals = await fetchDeals();

    console.log(deals);
}

main();