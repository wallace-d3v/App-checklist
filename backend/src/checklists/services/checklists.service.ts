import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChecklistDto } from '../dto/create-checklist.dto';
import { UpdateChecklistDto } from '../dto/update-checklist.dto';
import { ChecklistValidationsService } from './checklist-validations.service';
import { ChecklistsQueryService } from './checklists-query.service';

@Injectable()
export class ChecklistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: ChecklistsQueryService,
    private readonly validations: ChecklistValidationsService,
  ) {}

  findAll() {
    return this.queryService.findAll();
  }

  findOne(id: number) {
    return this.queryService.findOne(id);
  }

  async create(dto: CreateChecklistDto) {
    await this.validateChecklistData(dto);
    await this.validations.validateGerenteCargo(dto.cargoId);

    const checklist = await this.prisma.checklistModelo.create({
      data: {
        lojaId: dto.lojaId,
        nome: dto.nome,
        cargoId: dto.cargoId,
        turnoId: dto.turnoId,
        usuarioId: dto.usuarioId,
        frequencia: dto.frequencia,
        ativo: dto.ativo ?? true,
      },
    });

    return { message: 'Checklist criado com sucesso.', data: checklist };
  }

  async update(id: number, dto: UpdateChecklistDto) {
    await this.queryService.findOne(id);
    await this.validateChecklistData(dto);

    if (dto.cargoId) {
      await this.validations.validateGerenteCargo(dto.cargoId);
    }

    await this.prisma.checklistModelo.update({ where: { id }, data: dto });
    return { message: 'Checklist atualizado com sucesso.' };
  }

  async setAtivo(id: number, ativo: boolean) {
    await this.queryService.findOne(id);
    await this.prisma.checklistModelo.update({ where: { id }, data: { ativo } });
    return { message: ativo ? 'Checklist ativado com sucesso.' : 'Checklist inativado com sucesso.' };
  }

  private async validateChecklistData(dto: Partial<CreateChecklistDto>) {
    await this.validations.validateLoja(dto.lojaId);
    await this.validations.validateCargo(dto.cargoId);
    await this.validations.validateTurno(dto.turnoId, dto.lojaId);
    await this.validations.validateUsuario(dto.usuarioId, dto.lojaId);
  }
}
