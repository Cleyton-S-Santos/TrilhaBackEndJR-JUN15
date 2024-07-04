import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ApiHeader, ApiHeaders } from "@nestjs/swagger";
import { Request } from "express";
import { UserData } from "src/interfaces/UserData.interface";
import { UpdateTarefaDTO } from "src/models/dtos/updateTarefa.dto";
import { TarefaModel } from "src/models/tarefa.model";
import { TarefaService } from "src/service/TarefaService";

@Controller('/tarefa')
export class TarefaController {
    constructor(private readonly tarefaService: TarefaService){}

    @Post('/create')
    @ApiHeader({name: "auth-token", required: true, description: "Bearer token..."})
    async createTarefa(@Body() tarefa: TarefaModel, @Req() request: Request){
        const userData = request['userData'] as UserData;
        return await this.tarefaService.create(tarefa, userData.id)
    }

    @Delete("/delete/:tarefaId")
    @ApiHeader({name: "auth-token", required: true, description: "Bearer token..."})
    async deleteTarefa(@Param("tarefaId") tarefaId: number, @Req() request: Request){
        const userData = request['userData'] as UserData;
        return await this.tarefaService.delete(userData.id, +tarefaId)
    }

    @Get('/list')
    @ApiHeader({name: "auth-token", required: true, description: "Bearer token..."})
    async listTarefas(@Req() request: Request){
        const userData = request['userData'] as UserData;
        return await this.tarefaService.listTarefaByUserId(userData.id)
    }

    @Patch("/update/:tarefaId")
    @ApiHeader({name: "auth-token", required: true, description: "Bearer token..."})
    async updateTarefa(@Param("tarefaId") tarefaId: number, @Body() tarefa: UpdateTarefaDTO, @Req() request: Request){
        const userData = request['userData'] as UserData;
        return await this.tarefaService.updateTarefa(+tarefaId, tarefa, userData.id)
    }

    @Get("/details/:tarefaId")
    @ApiHeader({name: "auth-token", required: true, description: "Bearer token..."})
    async getTarefaById(@Param("tarefaId") tarefaId: number, @Req() request: Request){
        const userData = request['userData'] as UserData;
        return await this.tarefaService.findByTarefaId(+tarefaId, userData.id)
    }
}