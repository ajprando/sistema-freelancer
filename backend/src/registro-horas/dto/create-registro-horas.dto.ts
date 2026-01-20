import { IsUUID, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateRegistroHorasDto {
  @IsDateString()
  inicio: string;

  @IsDateString()
  @IsOptional()
  fim?: string;

  @IsInt()
  @Min(0, { message: 'Duração em minutos deve ser maior ou igual a 0' })
  @IsOptional()
  duracaoMinutos?: number;

  @IsUUID()
  atividadeId: string;
}
