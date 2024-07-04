import { UpdateTarefaDTO } from "src/models/dtos/updateTarefa.dto"
import { TarefaModel } from "src/models/tarefa.model"

export interface TarefaPort {
    deleteTarefa(userId: number, tarefaId: number) : Promise<any>
    createTarefa(tarefa: TarefaModel, userId: number): Promise<any>
    listByUser(userId: number): Promise<any[]>
    findTarefaBydId(tarefaId: number, userId: number) : Promise<any>
    updateTarefa(tarefaId: number, usuarioId: number, tareta: UpdateTarefaDTO) : Promise<any>
}