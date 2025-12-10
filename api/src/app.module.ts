import { Module } from "@nestjs/common";
import { BetsModule } from "./bets/bets.module.js";

@Module({
  imports: [BetsModule]
})
export class AppModule {}
