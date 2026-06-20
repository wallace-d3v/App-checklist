import { IsInt, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTurnoDto {
  @IsInt()
  lojaId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  horarioInicio: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  horarioFim: string;
}
