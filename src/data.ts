import Database from "better-sqlite3";
import type { Deal } from "./types.ts";

const db = new Database("deals.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        votes INTEGER NOT NULL,
        posted_at TEXT NOT NULL,
        retailer TEXT
    )
`);

export function hasDeal(id: string): boolean {
  const stmt = db.prepare("SELECT id FROM deals WHERE id = ?");

  const result = stmt.get(id);

  return !!result;
}

export function saveDeal(deal: Deal): void {
  const sql = db.prepare(`
        INSERT INTO deals (
            id,
            title,
            url,
            votes,
            posted_at,
            retailer
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

  sql.run(
    deal.id,
    deal.title,
    deal.url,
    deal.votes,
    deal.postedAt,
    deal.retailer,
  );
}

export function deleteOldDeals(days: number = 7): void {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const stmt = db.prepare(`
        DELETE FROM deals
        WHERE posted_at < ?
    `);

  stmt.run(cutoff.toISOString());
}
