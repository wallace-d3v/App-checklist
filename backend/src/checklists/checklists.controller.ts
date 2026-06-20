import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { ReordenarTarefasDto } from './dto/reordenar-tarefas.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { ChecklistTarefasService } from './services/checklist-tarefas.service';
import { ChecklistsService } from './services/checklists.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN)
@Controller('checklists')
export class ChecklistsController {
  constructor(
    private readonly checklistsService: ChecklistsService,
    private readonly tarefasService: ChecklistTarefasService,
  ) {}

  @Get()
  findAll() {
    return this.checklistsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateChecklistDto) {
    return this.checklistsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checklistsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChecklistDto) {
    return this.checklistsService.update(Number(id), dto);
  }

  @Patch(':id/ativar')
  ativar(@Param('id') id: string) {
    return this.checklistsService.setAtivo(Number(id), true);
  }

  @Patch(':id/inativar')
  inativar(@Param('id') id: string) {
    return this.checklistsService.setAtivo(Number(id), false);
  }

  @Post(':id/tarefas')
  createTarefa(@Param('id') id: string, @Body() dto: CreateTarefaDto) {
    return this.tarefasService.create(Number(id), dto);
  }

  @Patch(':id/tarefas/reordenar')
  reordenar(@Param('id') id: string, @Body() dto: ReordenarTarefasDto) {
    return this.tarefasService.reordenar(Number(id), dto);
  }

  @Patch(':id/tarefas/:tarefaId')
  updateTarefa(@Param('id') id: string, @Param('tarefaId') tarefaId: string, @Body() dto: UpdateTarefaDto) {
    return this.tarefasService.update(Number(id), Number(tarefaId), dto);
  }
}
