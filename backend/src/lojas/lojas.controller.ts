import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { LojasService } from './lojas.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN)
@Controller('lojas')
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @Get()
  findAll() {
    return this.lojasService.findAll();
  }

  @Post()
  create(@Body() dto: CreateLojaDto) {
    return this.lojasService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLojaDto) {
    return this.lojasService.update(Number(id), dto);
  }

  @Patch(':id/ativar')
  ativar(@Param('id') id: string) {
    return this.lojasService.setAtivo(Number(id), true);
  }

  @Patch(':id/inativar')
  inativar(@Param('id') id: string) {
    return this.lojasService.setAtivo(Number(id), false);
  }
}
