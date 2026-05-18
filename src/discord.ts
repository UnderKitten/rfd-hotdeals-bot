import axios from "axios";
import dotenv from "dotenv";
import type { Deal } from "./types.js";

dotenv.config();

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

export async function notifyDeals(deals: Deal[]): Promise<void> {
    if (!webhookUrl) {
        throw new Error("DISCORD_WEBHOOK_URL is missing");
    }

    for (const deal of deals) {
        const message =
            `🔥 **${deal.title}**\n` +
            `🏪 ${deal.retailer}\n` +
            `👍 ${deal.votes} votes\n` +
            `${deal.url}`;

        await axios.post(webhookUrl, {
            content: message,
        });
    }
}