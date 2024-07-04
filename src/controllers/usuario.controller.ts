import { Body, Controller, Post } from "@nestjs/common";
import { LoginUsuarioDto } from "src/models/dtos/loginUsuario.dto";
import { UsuarioModel } from "src/models/usuario.model";
import { UsuarioService } from "src/service/usuarioService";

@Controller('/usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService){}

    @Post('/create')
    async createTarefa(@Body() usuario: UsuarioModel){
        return this.usuarioService.create(usuario)
    }

    @Post('/login')
    async loginUsuario(@Body() loginDto: LoginUsuarioDto){
        return this.usuarioService.login(loginDto.email, loginDto.password)
    }
}