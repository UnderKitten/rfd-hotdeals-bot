import axios from "axios";
import * as cheerio from "cheerio";
import type { Deal } from "./types.ts";

const BASE_URL = "https://forums.redflagdeals.com";

export async function fetchDeals(): Promise<Deal[]> {
  const response = await axios.get(`${BASE_URL}/hot-deals-f9/`);

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

  console.log();

  return deals.filter(deal => deal.votes >= 15);
}
