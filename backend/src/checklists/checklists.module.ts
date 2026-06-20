import { Module } from '@nestjs/common';
import { ChecklistsController } from './checklists.controller';
import { ChecklistTarefasService } from './services/checklist-tarefas.service';
import { ChecklistsService } from './services/checklists.service';

@Module({
  controllers: [ChecklistsController],
  providers: [ChecklistsService, ChecklistTarefasService],
})
export class ChecklistsModule {}
