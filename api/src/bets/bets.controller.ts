import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { CreateBetDto } from "./bet.dto.js";
import { BetsService } from "./bets.service.js";

@Controller("bets")
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  create(@Body() body: CreateBetDto, @Headers("x-user-id") userId?: string) {
    const uid = userId || "demo";
    const bet = this.betsService.createBet({ ...body, userId: uid });
    return {
      success: {
        type: bet.result === "win" ? "win" : "lose",
        profit: bet.profit,
        number: bet.number,
        hash: bet.hash,
        hid: bet.hid,
        check_bet: bet.id,
        new_balance: bet.newBalance,
        balance: bet.newBalance,
        html: {
          salt1: bet.salt1,
          salt2: bet.salt2,
          number: bet.number,
          hash: bet.hash
        }
      }
    };
  }

  @Get(":id")
  get(@Param("id") id: string, @Headers("x-user-id") userId?: string) {
    const bet = this.betsService.getBet(id);
    if (!bet) {
      return { error: { text: "Игра не найдена" } };
    }
    const balance = this.betsService.getBalance(userId || "demo");
    return {
      hash: bet.hash,
      salt1: bet.salt1,
      salt2: bet.salt2,
      number: bet.number,
      betSize: bet.betSize,
      betPercent: bet.betPercent,
      direction: bet.direction,
      result: bet.result,
      profit: bet.profit,
      balance
    };
  }
}
