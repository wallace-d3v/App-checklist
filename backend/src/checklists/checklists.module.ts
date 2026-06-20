import { Module } from '@nestjs/common';
import { ChecklistsController } from './checklists.controller';
import { ChecklistTarefasService } from './services/checklist-tarefas.service';
import { ChecklistValidationsService } from './services/checklist-validations.service';
import { ChecklistsQueryService } from './services/checklists-query.service';
import { ChecklistsService } from './services/checklists.service';

@Module({
  controllers: [ChecklistsController],
  providers: [
    ChecklistsService,
    ChecklistsQueryService,
    ChecklistValidationsService,
    ChecklistTarefasService,
  ],
})
export class ChecklistsModule {}
