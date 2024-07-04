import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ErrorBuilderHelper } from 'src/helper/error.builder';
import { UpdateTarefaDTO } from 'src/models/dtos/updateTarefa.dto';
import { TarefaModel } from 'src/models/tarefa.model';
import { TarefaPort } from 'src/port/tarefa.port';

@Injectable()
export class TarefaAdapter implements TarefaPort {
  private readonly logger: Logger;
  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(TarefaAdapter.name);
  }

  async createTarefa(tarefa: TarefaModel, userId: number) {
    const epic = '[createTarefa]'
    this.logger.debug(`${epic} -> entrada com valores -> ${JSON.stringify(tarefa)}`)
    try {
      return await this.prismaService.tarefa.create({
        data: {
          titulo: tarefa.titulo,
          descricao: tarefa.descricao ?? '',
          dataLimite: tarefa.dataLimite,
          concluida: false,
          usuarioId: userId,
        },
      });
    } catch (err) {
      this.logger.error(`erro ao tentar salvar tarefa:`, err)
      return ErrorBuilderHelper.buildError({errorMessage: "Erro ao criar tarefa", httpStatus: HttpStatus.BAD_REQUEST, details: err.message})
    }
  }

  async deleteTarefa(userId: number, tarefaId: number){
    const epic = "[deleteTarefa]"
    this.logger.debug(`${epic} -> entrada para deletar tarefa de id ${tarefaId} do usuario com id ${userId}`)
    try {
      return await this.prismaService.tarefa.delete({
        where: {
          id: tarefaId,
          AND: {
            usuarioId: userId
          }
        }
      })
    } catch (err) {
      this.logger.error(`erro ao tentar deletar tarefa`, err)
      if(err.code == "P2025"){
        return ErrorBuilderHelper.buildError({
          errorMessage: "Erro ao deletar tarefa", 
          httpStatus: HttpStatus.NOT_FOUND, 
          details: err.meta.modelName == 'Tarefa' ? 
            "Tarefa não foi encontrada" : "Usuario não foi encontrado"})
      }
      return ErrorBuilderHelper.buildError({errorMessage: "Erro ao deletar tarefa", httpStatus: HttpStatus.BAD_REQUEST, details: err.message})
    }
  }

  async listByUser(userId: number): Promise<any[] | any>{
    const epic = "[listByUser]"
    this.logger.debug(`${epic} -> entrada listar tarefas do usuario com id ${userId}`)
    try {
      return await this.prismaService.tarefa.findMany({
        where: {
          usuarioId: userId
        }
      })
    } catch (err) {
      this.logger.error(`erro ao tentar deletar tarefa: ${JSON.stringify(err)}`)
      return ErrorBuilderHelper.buildError({errorMessage: "Erro ao listar tarefas", httpStatus: HttpStatus.BAD_REQUEST, details: err.message})
    }
  }

  async findTarefaBydId(tarefaId: number, userId: number){
    const epic = "[findTarefaBydId]"
    this.logger.debug(`${epic} -> entrada pesquisa tarefas com id ${tarefaId}`)
    try {
      const tarefa = await this.prismaService.tarefa.findFirst({
        where: {
          usuarioId: userId,
          AND: {
            id: tarefaId
          }
        }
      })
      if(!tarefa){
        return ErrorBuilderHelper.buildError({errorMessage: "A tarefa não foi encontrada!", httpStatus: HttpStatus.NOT_FOUND})
      }
      return tarefa;
    } catch (err) {
      this.logger.error(`erro ao tentar pesquisa tarefas: ${JSON.stringify(err)}`)
      return ErrorBuilderHelper.buildError({errorMessage: "Erro ao buscar tarefas", httpStatus: HttpStatus.BAD_REQUEST, details: err.message})
    }
  }

  async updateTarefa(tarefaId: number, usuarioId: number, tareta: UpdateTarefaDTO) {
    const tarefaExists = await this.findTarefaBydId(tarefaId, usuarioId);
    if(!tarefaExists){
      return ErrorBuilderHelper.buildError({
        errorMessage: "Tarefa não encontrada",
        httpStatus: HttpStatus.NOT_FOUND, 
        details: `A tarefa com id ${tarefaId} não existe pro usuario com id ${usuarioId}`})
    }

    try {
      return this.prismaService.tarefa.update({
        where: {
          id: tarefaId,
          AND: {
            usuarioId: usuarioId
          }
        },
        data: tareta
      })
    } catch(err){
      return ErrorBuilderHelper.buildError({
        errorMessage: "Erro ao atualizar tarefa", 
        httpStatus: HttpStatus.BAD_REQUEST, 
        details: "A tarefa do usuario não pode ser atualizada tente novamente mais tarde ou entre em contato com o suporte"})
    }
  }
}
