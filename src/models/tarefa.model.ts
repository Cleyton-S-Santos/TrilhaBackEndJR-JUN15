import { ApiProperty } from "@nestjs/swagger";

export class TarefaModel {
  id: number;
  @ApiProperty({description: "Titulo da tarefa"})
  titulo: string;
  @ApiProperty({description: "descricao da tarefa", required: false})
  descricao?: string;
  @ApiProperty({description: "data limite", required: true})
  dataLimite: Date;
  concluida?: boolean;
  usuarioId?: number;
}
