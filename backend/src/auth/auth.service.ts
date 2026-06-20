import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuario: dto.usuario },
      include: { loja: true, cargo: true, turno: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo. Fale com o administrador.');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    const payload = {
      sub: usuario.id,
      id: usuario.id,
      nome: usuario.nome,
      tipoUsuario: usuario.tipoUsuario,
      lojaId: usuario.lojaId,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        usuario: usuario.usuario,
        tipoUsuario: usuario.tipoUsuario,
        lojaId: usuario.lojaId,
        loja: usuario.loja,
        cargo: usuario.cargo,
        turno: usuario.turno,
      },
    };
  }

  async me(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { loja: true, cargo: true, turno: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const { senhaHash, ...dados } = usuario;
    return dados;
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const senhaValida = await bcrypt.compare(dto.senhaAtual, usuario.senhaHash);

    if (!senhaValida) {
      throw new BadRequestException('Senha atual inválida.');
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });

    return { message: 'Senha alterada com sucesso.' };
  }
}
