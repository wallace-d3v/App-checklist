import { DiaSemana, TipoUsuario } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsOptional()
  @IsInt()
  lojaId?: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(TipoUsuario)
  tipoUsuario: TipoUsuario;

  @IsOptional()
  @IsInt()
  cargoId?: number;

  @IsOptional()
  @IsInt()
  turnoId?: number;

  @IsOptional()
  @IsEnum(DiaSemana)
  diaFolga?: DiaSemana;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
