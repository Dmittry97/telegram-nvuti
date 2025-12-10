import { createHash, randomInt, randomBytes } from "crypto";

export type BetDirection = "min" | "max";

export interface BetRequest {
  betSize: number;
  betPercent: number;
  direction: BetDirection;
}

export interface BetResult {
  id: string;
  hash: string;
  hid: string;
  salt1: string;
  salt2: string;
  number: number;
  profit: number;
  result: "win" | "lose";
  newBalance: number;
}

export function computeBetHash(salt1: string, number: number, salt2: string): string {
  const raw = `${salt1}|${number}|${salt2}`;
  return createHash("sha512").update(raw).digest("hex");
}

export function generateSalt(length = 12): string {
  return randomBytes(length).toString("hex");
}

export function generateOutcome(): { salt1: string; salt2: string; number: number; hash: string } {
  const salt1 = generateSalt();
  const salt2 = generateSalt();
  const number = randomInt(0, 1_000_000);
  const hash = computeBetHash(salt1, number, salt2);
  return { salt1, salt2, number, hash };
}

export function computeProfit(betSize: number, betPercent: number): number {
  return Number(((100 / betPercent) * betSize).toFixed(2));
}

export function resolveBet(number: number, betPercent: number, direction: BetDirection) {
  const threshold = Math.floor((betPercent / 100) * 999_999);
  const isWin = direction === "min" ? number <= threshold : number >= 999_999 - threshold;
  return { isWin, threshold, minRange: threshold, maxRange: 999_999 - threshold };
}
