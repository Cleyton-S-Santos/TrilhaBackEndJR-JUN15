import { PartialType, OmitType } from "@nestjs/swagger";
import { TarefaModel } from "../tarefa.model";

export class UpdateTarefaDTO extends PartialType(OmitType(TarefaModel, ['id', 'usuarioId'] as const)) {}