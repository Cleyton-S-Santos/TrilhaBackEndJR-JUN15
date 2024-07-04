import { ApiProperty } from '@nestjs/swagger';

export class UsuarioModel {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  senha: string;
}