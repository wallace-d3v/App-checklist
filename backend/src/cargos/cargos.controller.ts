import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CargosService } from './cargos.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN)
@Controller('cargos')
export class CargosController {
  constructor(private readonly cargosService: CargosService) {}

  @Get()
  findAll() {
    return this.cargosService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCargoDto) {
    return this.cargosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCargoDto) {
    return this.cargosService.update(Number(id), dto);
  }
}
