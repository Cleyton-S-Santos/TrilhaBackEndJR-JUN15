import { Inject, Injectable } from "@nestjs/common";
import { UpdateTarefaDTO } from "src/models/dtos/updateTarefa.dto";
import { TarefaModel } from "src/models/tarefa.model";
import { TarefaPort } from "src/port/tarefa.port";

@Injectable()
export class TarefaService {
    constructor(
        @Inject('TarefaAdapter')
        private readonly tarefaAdapter: TarefaPort  
    ){}
    
    async create(tarefa: TarefaModel, userId: number){
        return await this.tarefaAdapter.createTarefa(tarefa, userId);
    }

    async delete(userId: number, tarefaId: number){
        return await this.tarefaAdapter.deleteTarefa(userId, tarefaId);
    }

    async listTarefaByUserId(userId: number){
        return await this.tarefaAdapter.listByUser(userId)
    }

    async findByTarefaId(tarefaId: number, userId: number){
        return await this.tarefaAdapter.findTarefaBydId(tarefaId, userId)
    }

    async updateTarefa(tarefaId: number, data: UpdateTarefaDTO, userId: number){
        return await this.tarefaAdapter.updateTarefa(tarefaId, userId, data)
    }
}