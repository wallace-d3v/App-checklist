import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AlterarSenhaUsuarioDto } from './dto/alterar-senha-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({
      select: this.safeSelect(),
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.safeSelect(),
    });

    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    await this.validarUsuarioUnico(dto.usuario);
    await this.validarRelacionamentos(dto);

    if (dto.tipoUsuario === TipoUsuario.FUNCIONARIO) {
      if (!dto.lojaId || !dto.cargoId || !dto.turnoId || !dto.diaFolga) {
        throw new BadRequestException('Gerente precisa ter loja, cargo, turno e dia de folga.');
      }
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const { senha, ...dados } = dto;

    const usuario = await this.prisma.usuario.create({
      data: { ...dados, senhaHash, ativo: dto.ativo ?? true },
      select: this.safeSelect(),
    });

    return { message: 'Usuário criado com sucesso.', data: usuario };
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    await this.validarRelacionamentos(dto);

    await this.prisma.usuario.update({ where: { id }, data: dto });
    return { message: 'Usuário atualizado com sucesso.' };
  }

  async setAtivo(id: number, ativo: boolean) {
    await this.findOne(id);
    await this.prisma.usuario.update({ where: { id }, data: { ativo } });
    return { message: ativo ? 'Usuário ativado com sucesso.' : 'Usuário inativado com sucesso.' };
  }

  async alterarSenha(id: number, dto: AlterarSenhaUsuarioDto) {
    await this.findOne(id);
    const senhaHash = await bcrypt.hash(dto.novaSenha, 10);
    await this.prisma.usuario.update({ where: { id }, data: { senhaHash } });
    return { message: 'Senha alterada com sucesso.' };
  }

  private async validarUsuarioUnico(usuario: string) {
    const existente = await this.prisma.usuario.findUnique({ where: { usuario } });
    if (existente) throw new BadRequestException('Já existe um usuário com esse login.');
  }

  private async validarRelacionamentos(dto: Partial<CreateUsuarioDto>) {
    if (dto.lojaId) {
      const loja = await this.prisma.loja.findUnique({ where: { id: dto.lojaId } });
      if (!loja) throw new NotFoundException('Loja não encontrada.');
    }
    if (dto.cargoId) {
      const cargo = await this.prisma.cargo.findUnique({ where: { id: dto.cargoId } });
      if (!cargo) throw new NotFoundException('Cargo não encontrado.');
    }
    if (dto.turnoId) {
      const turno = await this.prisma.turno.findUnique({ where: { id: dto.turnoId } });
      if (!turno) throw new NotFoundException('Turno não encontrado.');
      if (dto.lojaId && turno.lojaId !== dto.lojaId) {
        throw new BadRequestException('Turno não pertence à loja informada.');
      }
    }
  }

  private safeSelect() {
    return {
      id: true,
      lojaId: true,
      nome: true,
      usuario: true,
      tipoUsuario: true,
      cargoId: true,
      turnoId: true,
      diaFolga: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
      loja: true,
      cargo: true,
      turno: true,
    };
  }
}
