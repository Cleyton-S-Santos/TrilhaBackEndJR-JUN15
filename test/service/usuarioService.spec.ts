import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, Logger } from '@nestjs/common';
import { UsuarioService } from 'src/service/usuarioService';
import { UsuarioPort } from 'src/port/usuario.port';
import { UsuarioModel } from 'src/models/usuario.model';
import { PasswordHelper } from 'src/helper/password.helper';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioPortMock: Partial<UsuarioPort>;

  beforeEach(async () => {
    usuarioPortMock = {
      create: jest.fn(),
      getUserByEmail: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: 'UsuarioAdapter', useValue: usuarioPortMock },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a usuario', async () => {
    const usuario: UsuarioModel = {nome: 'Usuário Teste', email: 'teste@teste.com', senha: 'senha123' };

    jest.spyOn(service, 'create').mockResolvedValue(usuario)

    const result = await service.create(usuario);

    expect(result).toEqual(usuario);
    expect(service.create).toHaveBeenCalledWith(usuario);
  });

  it('should login successfully', async () => {
    const email = 'teste@teste.com';
    const password = 'senha123';
    const usuario: UsuarioModel = { nome: 'Usuário Teste', email: email, senha: 'senha123' };

    jest.spyOn(usuarioPortMock, 'getUserByEmail').mockResolvedValue(usuario)
    jest.spyOn(PasswordHelper, 'hashPassword').mockResolvedValue('hashedPassword');
    jest.spyOn(PasswordHelper, 'comparePassword').mockResolvedValue(true);
    jest.spyOn(service, 'generateToken').mockResolvedValue('token');

    const result = await service.login(email, password);

    expect(result).toHaveProperty('accessToken');
    expect(usuarioPortMock.getUserByEmail).toHaveBeenCalledWith(email);
    expect(PasswordHelper.hashPassword).toHaveBeenCalledWith(password);
    expect(PasswordHelper.comparePassword).toHaveBeenCalledWith('hashedPassword', password);
    expect(service.generateToken).toHaveBeenCalledWith(usuario);
  });

  it('should return error for invalid login - user not found', async () => {
    const email = 'notfound@teste.com';
    const password = 'senha123';

    jest.spyOn(usuarioPortMock, 'getUserByEmail').mockResolvedValue(null)

    const result = await service.login(email, password) as any;

    expect(result.errorMessage).toEqual('Email ou senha inválido');
    expect(result.httpStatus).toEqual(HttpStatus.UNAUTHORIZED);
    expect(usuarioPortMock.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it('should return error for invalid login - wrong password', async () => {
    const email = 'teste@teste.com';
    const password = 'wrongpassword';
    const usuario: UsuarioModel = { nome: 'Usuário Teste', email: email, senha: 'senha123' };

    jest.spyOn(usuarioPortMock, 'getUserByEmail').mockResolvedValue(usuario)
    jest.spyOn(PasswordHelper, 'hashPassword').mockResolvedValue('hashedPassword');
    jest.spyOn(PasswordHelper, 'comparePassword').mockResolvedValue(false);

    const result = await service.login(email, password) as any;

    expect(result.errorMessage).toEqual('Email ou senha inválido');
    expect(result.httpStatus).toEqual(HttpStatus.UNAUTHORIZED);
    expect(usuarioPortMock.getUserByEmail).toHaveBeenCalledWith(email);
    expect(PasswordHelper.comparePassword).toHaveBeenCalledWith('hashedPassword', password);
  });

  it('should return error for login failure', async () => {
    const email = 'teste@teste.com';
    const password = 'senha123';

    jest.spyOn(usuarioPortMock, 'getUserByEmail').mockRejectedValue(new Error('Database error'))
    const result = await service.login(email, password) as any;

    expect(result.errorMessage).toEqual('Não foi possível fazer o seu login');
    expect(result.httpStatus).toEqual(HttpStatus.BAD_REQUEST);
    expect(usuarioPortMock.getUserByEmail).toHaveBeenCalledWith(email);
  });
});
