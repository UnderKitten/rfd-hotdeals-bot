import fs from "fs";
import path from "path";

const HEARTBEAT_FILE = path.join("data", "heartbeat.json");

type HeartbeatData = {
  lastHeartbeat: string;
};

export function shouldSendHeartbeat(hours: number = 6): boolean {
  try {
    const raw = fs.readFileSync(HEARTBEAT_FILE, "utf-8");
    const data = JSON.parse(raw) as HeartbeatData;

    const lastHeartbeat = new Date(data.lastHeartbeat);
    const now = new Date();

    const diffMs = now.getTime() - lastHeartbeat.getTime();

    return diffMs >= hours * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

export function updateHeartbeat(): void {
  const data: HeartbeatData = {
    lastHeartbeat: new Date().toISOString(),
  };

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(HEARTBEAT_FILE, JSON.stringify(data, null, 2), "utf-8");
}
