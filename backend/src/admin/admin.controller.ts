import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  dashboard(@Query('lojaId') lojaId?: string) {
    return this.service.dashboard(lojaId ? Number(lojaId) : undefined);
  }

  @Get('envios-hoje')
  hoje(@Query('lojaId') lojaId?: string) {
    return this.service.enviosHoje(lojaId ? Number(lojaId) : undefined);
  }

  @Get('historico')
  historico(@Query('lojaId') lojaId?: string) {
    return this.service.historico(lojaId ? Number(lojaId) : undefined);
  }

  @Get('envios/:id')
  detalhe(@Param('id') id: string) {
    return this.service.envioDetalhe(Number(id));
  }
}
