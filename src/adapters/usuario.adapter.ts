import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ErrorBuilderHelper } from 'src/helper/error.builder';
import { PasswordHelper } from 'src/helper/password.helper';
import { UsuarioModel } from 'src/models/usuario.model';
import { UsuarioPort } from 'src/port/usuario.port';

@Injectable()
export class UsuarioAdapter implements UsuarioPort {
  private readonly logger: Logger;
  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(UsuarioAdapter.name);
  }
    async create(data: UsuarioModel): Promise<Usuario | any> {
        const epic = '[create]'
        this.logger.debug(`${epic} -> entrada com valores -> ${JSON.stringify(data)}`)
        const passwordhashed = await PasswordHelper.hashPassword(data.senha);
        try {
            return await this.prismaService.usuario.create({
                data: {
                    email: data.email,
                    nome: data.nome,
                    senha: passwordhashed
                },
            });
        } catch (err) {
            this.logger.error(`erro ao tentar criar usuario:`, err)
            return ErrorBuilderHelper.buildError({errorMessage: "Erro ao criar tarefa", httpStatus: HttpStatus.BAD_REQUEST, details: err.message})
        }
    }

    async getUserByEmail(userEmail: string){
        try {
            return this.prismaService.usuario.findUnique({
                where: {
                    email: userEmail
                }
            })
        } catch(err){
            this.logger.error(`erro ao buscar por usuario:`, err)
            return ErrorBuilderHelper.buildError({errorMessage: "erro ao buscar por usuario", httpStatus: HttpStatus.BAD_REQUEST, details: err.message})
        }
    }
}
