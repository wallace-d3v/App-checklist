import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';

class ItemReordenacaoDto {
  @IsInt()
  id: number;

  @IsInt()
  ordem: number;
}

export class ReordenarTarefasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemReordenacaoDto)
  tarefas: ItemReordenacaoDto[];
}
