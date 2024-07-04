// tarefa.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTarefaDTO } from 'src/models/dtos/updateTarefa.dto';
import { TarefaModel } from 'src/models/tarefa.model';
import { TarefaPort } from 'src/port/tarefa.port';
import { TarefaService } from 'src/service/TarefaService';

describe('TarefaService', () => {
  let service: TarefaService;
  let tarefaPortMock: Partial<TarefaPort>;

  beforeEach(async () => {
    tarefaPortMock = {
      createTarefa: jest.fn(),
      deleteTarefa: jest.fn(),
      listByUser: jest.fn(),
      findTarefaBydId: jest.fn(),
      updateTarefa: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarefaService,
        { provide: 'TarefaAdapter', useValue: tarefaPortMock },
      ],
    }).compile();

    service = module.get<TarefaService>(TarefaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tarefa', async () => {
    const tarefa: TarefaModel = { id: 1, titulo: 'Tarefa 1', dataLimite: new Date() };

    jest.spyOn(service, 'create').mockResolvedValue(tarefa)

    const result = await service.create(tarefa, 1);

    expect(result).toEqual(tarefa);
    expect(service.create).toHaveBeenCalledWith(tarefa, 1);
  });

  it('should delete a tarefa', async () => {
    const userId = 1;
    const tarefaId = 1;
    jest.spyOn(service, 'delete').mockResolvedValue(true)

    const result = await service.delete(userId, tarefaId);

    expect(result).toEqual(true);
    expect(service.delete).toHaveBeenCalledWith(userId, tarefaId);
  });

  it('should list tarefas by user', async () => {
    const userId = 1;
    const tarefas: TarefaModel[] = [{ id: 1, titulo: 'Tarefa 1', dataLimite: new Date() }];
    jest.spyOn(service, 'listTarefaByUserId').mockResolvedValue(tarefas)

    const result = await service.listTarefaByUserId(userId);

    expect(result).toEqual(tarefas);
    expect(service.listTarefaByUserId).toHaveBeenCalledWith(userId);
  });

  it('should find tarefa by id', async () => {
    const userId = 1;
    const tarefaId = 1;
    const tarefa: TarefaModel = { id: tarefaId, titulo: 'Tarefa 1', dataLimite: new Date() };

    jest.spyOn(service, 'findByTarefaId').mockResolvedValue(tarefa)
    const result = await service.findByTarefaId(tarefaId, userId);

    expect(result).toEqual(tarefa);
    expect(service.findByTarefaId).toHaveBeenCalledWith(tarefaId, userId);
  });

  it('should update tarefa', async () => {
    const tarefaId = 1;
    const userId = 1;
    const updateData: UpdateTarefaDTO = { titulo: 'Tarefa Atualizada' };
    const updatedTarefa: TarefaModel = { id: tarefaId, ...updateData, dataLimite: new Date(), titulo: updateData.titulo };

    jest.spyOn(service, 'updateTarefa').mockResolvedValue(updatedTarefa)

    const result = await service.updateTarefa(tarefaId, updateData, userId);
    console.log(result)

    expect(result).toEqual(updatedTarefa);
    expect(service.updateTarefa).toHaveBeenCalledWith(tarefaId, updateData, userId);
  });
});
