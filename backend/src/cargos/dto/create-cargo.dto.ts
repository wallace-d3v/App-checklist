import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCargoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome: string;
}
