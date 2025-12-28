import { IsOptional, IsInt, Min } from 'class-validator';

export class IncrementCounterDto {
  @IsInt()
  @Min(1, { message: 'Incremento deve ser no mínimo 1' })
  @IsOptional()
  amount?: number;
}
