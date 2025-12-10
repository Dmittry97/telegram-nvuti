import { Injectable, BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BetDirection, BetResult, computeProfit, generateOutcome, resolveBet } from "@shared/core";

interface StoredBet extends BetResult {
  userId: string;
  betPercent: number;
  betSize: number;
  direction: BetDirection;
}

@Injectable()
export class BetsService {
  private bets = new Map<string, StoredBet>();
  private balances = new Map<string, number>();

  createBet(params: { betSize: number; betPercent: number; direction: BetDirection; userId: string }): BetResult {
    const { betSize, betPercent, direction, userId } = params;
    const balance = this.balances.get(userId) ?? 100;
    if (betSize > balance) {
      throw new BadRequestException("Недостаточно средств");
    }

    const { salt1, salt2, number, hash } = generateOutcome();
    const hid = randomUUID();
    const { isWin } = resolveBet(number, betPercent, direction);
    const profit = computeProfit(betSize, betPercent);
    const result = isWin ? "win" : "lose";
    const newBalance = isWin ? balance + profit - betSize : balance - betSize;

    const record: StoredBet = {
      id: hid,
      hash,
      hid,
      salt1,
      salt2,
      number,
      profit,
      result,
      newBalance,
      betPercent,
      betSize,
      direction,
      userId
    };

    this.balances.set(userId, newBalance);
    this.bets.set(hid, record);
    return record;
  }

  getBet(id: string): StoredBet | undefined {
    return this.bets.get(id);
  }

  getBalance(userId: string): number {
    return this.balances.get(userId) ?? 100;
  }
}
