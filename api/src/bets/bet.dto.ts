import { IsIn, IsNumber, Max, Min } from "class-validator";
import { BetDirection } from "@shared/core";

export class CreateBetDto {
  @IsNumber()
  @Min(0.01)
  betSize!: number;

  @IsNumber()
  @Min(1)
  @Max(95)
  betPercent!: number;

  @IsIn(["min", "max"])
  direction!: BetDirection;
}
