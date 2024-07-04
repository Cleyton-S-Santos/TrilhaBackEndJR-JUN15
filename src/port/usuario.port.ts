import { Usuario } from "@prisma/client";
import { UsuarioModel } from "src/models/usuario.model";

export interface UsuarioPort {
    create(data: UsuarioModel): Promise<Usuario | any>
    getUserByEmail(userEmail: string) : Promise<Usuario | any>
}