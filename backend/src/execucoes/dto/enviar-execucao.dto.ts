import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EnviarExecucaoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}$/)
  codigoConfirmacao: string;
}
