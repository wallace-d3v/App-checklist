import { IsDateString, IsOptional, IsInt } from 'class-validator';

export class GerarExecucoesDto {
  @IsOptional()
  @IsDateString()
  data?: string;

  @IsOptional()
  @IsInt()
  lojaId?: number;
}
