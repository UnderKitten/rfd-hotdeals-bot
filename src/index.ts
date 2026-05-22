import { fetchDeals } from "./scraper.js";
import { hasDeal, saveDeal, deleteOldDeals } from "./data.js";
import { notifyDeals, notifyError, notifyHeartbeat } from "./discord.js";
import { shouldSendHeartbeat, updateHeartbeat } from "./heartbeat.js";

async function main() {
  deleteOldDeals();

  const deals = await fetchDeals();

  if (shouldSendHeartbeat(6)) {
    await notifyHeartbeat(deals.length);
    updateHeartbeat();
  }

  if (deals.length < 5) {
    await notifyError(
      `Suspiciously low deal count detected: ${deals.length} deals scraped.`,
    );
  }

  const newDeals = deals.filter((deal) => !hasDeal(deal.id));

  if (newDeals.length === 0) {
    console.log("No new deals.");
    return;
  }

  for (const deal of newDeals) {
    await notifyDeals([deal]);
    saveDeal(deal);
  }

  console.log(`Sent ${newDeals.length} deal notifications.`);
}

main().catch(async (error) => {
  console.error("Bot failed:", error);

  try {
    await notifyError(error);
  } catch (discordError) {
    console.error("Failed to send Discord error:", discordError);
  }
});
