import { Injectable, NestMiddleware } from '@nestjs/common';
import { config } from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaService } from 'src/database/prisma.service';
import { UserData } from 'src/interfaces/UserData.interface';

config()
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService){}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['auth-token'] as string;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = verify(token, process.env.JWT_SECRECT) as any;
      const userId = decodedToken.id; 
      const usuario = await this.prismaService.usuario.findUnique({
        where: { id: Number(userId) },
      });

      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      req['userData'] = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      } as UserData;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  }
}
