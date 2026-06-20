import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTarefaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  secao?: string;

  @IsOptional()
  @IsString()
  grupo?: string;

  @IsOptional()
  @IsString()
  subgrupo?: string;

  @IsOptional()
  @IsBoolean()
  exigeFoto?: boolean;

  @IsOptional()
  @IsBoolean()
  exigeObservacao?: boolean;

  @IsInt()
  ordem: number;
}
