import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SalvarObservacaoDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observacao?: string;
}
