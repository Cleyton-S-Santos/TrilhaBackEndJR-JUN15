import { ApiProperty } from "@nestjs/swagger";

export class LoginUsuarioDto {
    @ApiProperty({description: "Email do usuario"})
    email: string;
    @ApiProperty({description: "Senha do usuario"})
    password: string;
}