import { Module } from "@nestjs/common";
import { BetsController } from "./bets.controller.js";
import { BetsService } from "./bets.service.js";

@Module({
  providers: [BetsService],
  controllers: [BetsController]
})
export class BetsModule {}
