import axios from "axios";
import dotenv from "dotenv";
import type { Deal } from "./types.js";

dotenv.config();

function getWebhookUrl(): string {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is missing");
  }

  return webhookUrl;
}

export async function notifyDeals(deals: Deal[]): Promise<void> {
  const webhookUrl = getWebhookUrl();

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

export async function notifyError(error: unknown): Promise<void> {
  const webhookUrl = getWebhookUrl();

  const message =
    error instanceof Error ? error.stack || error.message : String(error);

  await axios.post(webhookUrl, {
    content: `🚨 **RFD Bot Error**\n\`\`\`\n${message}\n\`\`\``,
  });
}
