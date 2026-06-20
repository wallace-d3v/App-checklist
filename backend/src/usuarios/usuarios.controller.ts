import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AlterarSenhaUsuarioDto } from './dto/alterar-senha-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(Number(id), dto);
  }

  @Patch(':id/ativar')
  ativar(@Param('id') id: string) {
    return this.usuariosService.setAtivo(Number(id), true);
  }

  @Patch(':id/inativar')
  inativar(@Param('id') id: string) {
    return this.usuariosService.setAtivo(Number(id), false);
  }

  @Patch(':id/alterar-senha')
  alterarSenha(@Param('id') id: string, @Body() dto: AlterarSenhaUsuarioDto) {
    return this.usuariosService.alterarSenha(Number(id), dto);
  }
}
