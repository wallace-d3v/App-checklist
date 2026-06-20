import { FrequenciaChecklist } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChecklistDto {
  @IsInt()
  lojaId: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsInt()
  cargoId: number;

  @IsOptional()
  @IsInt()
  turnoId?: number;

  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsEnum(FrequenciaChecklist)
  frequencia?: FrequenciaChecklist;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
