import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { MeService } from './me.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.FUNCIONARIO)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('checklist-hoje')
  checklistHoje(@CurrentUser() user: any) {
    return this.meService.checklistHoje(user.id);
  }

  @Get('execucoes')
  minhasExecucoes(@CurrentUser() user: any) {
    return this.meService.minhasExecucoes(user.id);
  }

  @Get('execucoes/:id')
  minhaExecucao(@Param('id') id: string, @CurrentUser() user: any) {
    return this.meService.minhaExecucao(Number(id), user.id);
  }
}
