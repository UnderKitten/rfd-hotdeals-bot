import axios from "axios";
import * as cheerio from "cheerio";

type Deal = {
    title: string;
    href: string;
    votes: number;
};

async function main() {
    const response = await axios.get("https://forums.redflagdeals.com/hot-deals-f9/");
    const $ = cheerio.load(response.data);

    const deals: Deal[] = $("a.topic-card-info.thread_info")
        .map((_, el) => {
            const title = $(el).find("h3.thread_title").text().trim();
            const href = $(el).attr("href") ?? "";

            const votesText = $(el)
                .find("span.votes.thread_stat")
                .text()
                .trim();

            const votes = parseInt(votesText, 10) || 0;

            return {
                title,
                href,
                votes,
            };
        })
        .get();

    console.log(deals);
}

main();