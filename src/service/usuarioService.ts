import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ErrorBuilderHelper } from "src/helper/error.builder";
import { UsuarioModel } from "src/models/usuario.model";
import { UsuarioPort } from "src/port/usuario.port";
import {sign} from "jsonwebtoken"
import { Usuario } from "@prisma/client";
import { config } from "dotenv";
import { PasswordHelper } from "src/helper/password.helper";

config()
@Injectable()
export class UsuarioService {
    private readonly logger: Logger
    constructor(
        @Inject('UsuarioAdapter')
        private readonly usuarioAdapter: UsuarioPort 
    ){
        this.logger = new Logger(UsuarioService.name)
    }
    
    async create(usuario: UsuarioModel){
        return await this.usuarioAdapter.create(usuario);
    }

    async login(email: string, password: string){
        try{
            const user = await this.usuarioAdapter.getUserByEmail(email);
            if(!user){
                //não que que saibam qual email está ou não cadastrado no meu banco, por isso a msg de erro
                return ErrorBuilderHelper.buildError({errorMessage: "Email ou senha inválido", httpStatus: HttpStatus.UNAUTHORIZED, details: ""})
            }

            console.log(user)

            const hashPassword = await PasswordHelper.hashPassword(password)
            const passwordIsCorrectly = await PasswordHelper.comparePassword(hashPassword, password);

            if(!passwordIsCorrectly){
                return ErrorBuilderHelper.buildError({errorMessage: "Email ou senha inválido", httpStatus: HttpStatus.UNAUTHORIZED, details: ""})
            }

            return {accessToken: await this.generateToken(user)}
        } catch(err){
            this.logger.error(`Erro ao tentar processar login do usuario`)
            return ErrorBuilderHelper.buildError({errorMessage: "Não foi possível fazer o seu login", httpStatus: HttpStatus.BAD_REQUEST, details: ""})
        }

    }

    async generateToken(usuario: Usuario){
        return sign(usuario, process.env.JWT_SECRECT, {expiresIn: '1h'})
    }
}