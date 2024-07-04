import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { TarefaAdapter } from './adapters/tarefa.adapter';
import { TarefaController } from './controllers/tarefa.controller';
import { TarefaService } from './service/TarefaService';
import { PrismaService } from './database/prisma.service';
import { UsuarioAdapter } from './adapters/usuario.adapter';
import { UsuarioService } from './service/usuarioService';
import { UsuarioController } from './controllers/usuario.controller';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

@Module({
  imports: [],
  controllers: [AppController, TarefaController, UsuarioController],
  providers: [
    TarefaService,
    UsuarioService,
    PrismaService,
    {
      provide: "TarefaAdapter",
      useClass: TarefaAdapter
    },
    {
      provide: "UsuarioAdapter",
      useClass: UsuarioAdapter
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/check')
      .exclude('/usuario/create')
      .exclude('/usuario/login')
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
