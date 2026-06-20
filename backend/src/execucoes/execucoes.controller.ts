import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { EnviarExecucaoDto } from './dto/enviar-execucao.dto';
import { GerarExecucoesDto } from './dto/gerar-execucoes.dto';
import { SalvarObservacaoDto } from './dto/salvar-observacao.dto';
import { ExecucoesEnvioService } from './services/execucoes-envio.service';
import { ExecucoesGeracaoService } from './services/execucoes-geracao.service';
import { ExecucoesQueryService } from './services/execucoes-query.service';
import { ExecucoesTarefasService } from './services/execucoes-tarefas.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('execucoes')
export class ExecucoesController {
  constructor(
    private readonly geracaoService: ExecucoesGeracaoService,
    private readonly queryService: ExecucoesQueryService,
    private readonly tarefasService: ExecucoesTarefasService,
    private readonly envioService: ExecucoesEnvioService,
  ) {}

  @Post('gerar-do-dia')
  @Roles(TipoUsuario.ADMIN)
  gerarDoDia(@Body() dto: GerarExecucoesDto) {
    return this.geracaoService.gerarDoDia(dto);
  }

  @Get('hoje')
  @Roles(TipoUsuario.ADMIN)
  hoje(@Query('lojaId') lojaId?: string) {
    return this.queryService.findHoje(lojaId ? Number(lojaId) : undefined);
  }

  @Get('historico')
  @Roles(TipoUsuario.ADMIN)
  historico(@Query('lojaId') lojaId?: string) {
    return this.queryService.findHistorico(lojaId ? Number(lojaId) : undefined);
  }

  @Get(':id')
  @Roles(TipoUsuario.ADMIN)
  findOne(@Param('id') id: string) {
    return this.queryService.findOne(Number(id));
  }

  @Patch(':id/iniciar')
  @Roles(TipoUsuario.FUNCIONARIO)
  iniciar(@Param('id') id: string) {
    return this.tarefasService.iniciar(Number(id));
  }

  @Patch(':id/enviar')
  @Roles(TipoUsuario.FUNCIONARIO)
  enviar(@Param('id') id: string, @Body() dto: EnviarExecucaoDto) {
    return this.envioService.enviar(Number(id), dto);
  }

  @Patch(':execucaoId/tarefas/:tarefaExecucaoId/observacao')
  @Roles(TipoUsuario.FUNCIONARIO)
  observacao(
    @Param('execucaoId') execucaoId: string,
    @Param('tarefaExecucaoId') tarefaExecucaoId: string,
    @Body() dto: SalvarObservacaoDto,
  ) {
    return this.tarefasService.salvarObservacao(Number(execucaoId), Number(tarefaExecucaoId), dto);
  }

  @Patch(':execucaoId/tarefas/:tarefaExecucaoId/concluir')
  @Roles(TipoUsuario.FUNCIONARIO)
  concluir(@Param('execucaoId') execucaoId: string, @Param('tarefaExecucaoId') tarefaExecucaoId: string) {
    return this.tarefasService.concluir(Number(execucaoId), Number(tarefaExecucaoId));
  }
}
