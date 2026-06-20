import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TipoUsuario } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { FotosService } from './fotos.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class FotosController {
  constructor(private readonly service: FotosService) {}

  @Post('execucoes/:execucaoId/tarefas/:tarefaExecucaoId/foto')
  @Roles(TipoUsuario.FUNCIONARIO)
  @UseInterceptors(FileInterceptor('foto'))
  upload(@Param('execucaoId') execucaoId: string, @Param('tarefaExecucaoId') tarefaExecucaoId: string, @CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.service.upload(Number(execucaoId), Number(tarefaExecucaoId), user.id, file);
  }

  @Get('fotos/:id')
  @Roles(TipoUsuario.ADMIN)
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }
}
