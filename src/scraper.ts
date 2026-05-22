import axios from "axios";
import * as cheerio from "cheerio";
import type { Deal } from "./types.js";

const BASE_URL = "https://forums.redflagdeals.com";

const SOURCES = ["/hot-deals-f9/", "/hot-deals-f9/trending/"];

function isRecentDeal(postedAt: string, maxDays: number = 14): boolean {
  const postedDate = new Date(postedAt);
  const cutoff = new Date();

  cutoff.setDate(cutoff.getDate() - maxDays);

  return postedDate >= cutoff;
}

async function fetchDealsFromPage(path: string): Promise<Deal[]> {
  const response = await axios.get(`${BASE_URL}${path}`, {
    timeout: 15000,
  });
  
  const $ = cheerio.load(response.data);

  const deals: Deal[] = $("a.topic-card-info.thread_info")
    .map((_, el) => {
      const title = $(el).find("h3.thread_title").text().trim();

      const relativeHref = $(el).attr("href") ?? "";
      const url = `${BASE_URL}${relativeHref}`;

      const votesText = $(el).find("span.votes.thread_stat").text().trim();

      const votes = parseInt(votesText, 10) || 0;

      const postedAt = $(el).find("time.topic_time").attr("datetime") ?? "";

      const retailer = $(el).find("div.dealer_name").first().text().trim();

      const idMatch = relativeHref.match(/(\d+)\/?$/);
      const id = idMatch?.[1] ?? "";

      return {
        id,
        title,
        url,
        votes,
        postedAt,
        retailer,
      };
    })
    .get();

  return deals.filter(
    (deal) => deal.votes >= 20 && isRecentDeal(deal.postedAt),
  );
}

export async function fetchDeals(): Promise<Deal[]> {
  const results = await Promise.all(
    SOURCES.map((source) => fetchDealsFromPage(source)),
  );

  const allDeals = results.flat();

  const dedupedDeals = Array.from(
    new Map(allDeals.map((deal) => [deal.id, deal])).values(),
  );

  return dedupedDeals;
}
