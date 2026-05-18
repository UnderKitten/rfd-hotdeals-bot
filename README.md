# RFD Hot Deals Bot

Weekend project because I realized I was spending way too much time checking RedFlagDeals manually to avoid missing good deals.

This bot watches:

- Hot Deals (1st page)
- Trending Deals (1st page)

Filters deals with **20+ upvotes** as a rough signal that something is actually worth looking at. Not a perfect system, but good enough to catch deals before they're long gone.


If a new deal matches:
- sends a Discord notification
- stores it in SQLite to avoid duplicate alerts
- cleans up old entries after 7 days
- runs automatically via Windows Task Scheduler on a mini PC

## Stack

- TypeScript
- Node.js
- Axios
- Cheerio
- SQLite (`better-sqlite3`)
- Discord Webhooks

## Why?

Mostly a small useful automation project that solves a real problem for me.

Also a decent excuse to build something practical instead of just endlessly browsing deal forums.
