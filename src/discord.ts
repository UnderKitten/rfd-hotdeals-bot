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
    const sentAt = new Date().toLocaleString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const postedAt = new Date(deal.postedAt).toLocaleString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const message =
      `------------------------------------------------------------------` +
      `\n\n🔥**New Hot Deal**` +
      `**${deal.title}**\n\n` +
      `🏪 Retailer: ${deal.retailer || "Unknown"}\n` +
      `👍 Votes: ${deal.votes}\n` +
      `🕒 Posted: ${postedAt}\n` +
      `📬 Alert sent: ${sentAt}\n\n` +
      `${deal.url}`;

    await axios.post(webhookUrl, {
      content: message,
    });
  }
}

export async function notifyHeartbeat(checkedDeals: number): Promise<void> {
  const webhookUrl = getWebhookUrl();

  const now = new Date().toLocaleString("en-CA");

  const message =
    `✅ **RFD Bot Heartbeat**\n\n` +
    `Checked deals: ${checkedDeals}\n` +
    `Time: ${now}`;

  await axios.post(webhookUrl, {
    content: message,
  });
}

export async function notifyError(error: unknown): Promise<void> {
  const webhookUrl = getWebhookUrl();

  const message =
    error instanceof Error ? error.stack || error.message : String(error);

  await axios.post(webhookUrl, {
    content: `🚨 **RFD Bot Error**\n\`\`\`\n${message}\n\`\`\``,
  });
}
