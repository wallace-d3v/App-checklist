import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AlterarSenhaUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  novaSenha: string;
}
