import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from '../../../domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserController (Unit)', () => {
  let controller: UserController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should execute CreateUserCommand and return the created user toDto', async () => {
      const mockDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
        role: 'ADMIN' as any,
      };

      const mockUserEntity = new UserEntity({
        id: 'user-123',
        email: mockDto.email,
        name: mockDto.name,
        role: mockDto.role,
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      commandBus.execute.mockResolvedValue(mockUserEntity);

      const result = await controller.create(mockDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          password: mockDto.password,
          user: expect.objectContaining({
            email: mockDto.email,
            name: mockDto.name,
          }),
        }),
      );
      expect(result).toEqual(mockUserEntity.toDto());
    });
  });

  describe('findAll', () => {
    it('should execute GetUsersQuery and return paginated results', async () => {
      const mockQuery = { page: 1, size: 10 };
      const mockUserEntity = new UserEntity({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      queryBus.execute.mockResolvedValue({
        data: [mockUserEntity],
        meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
      });

      const result = await controller.findAll(mockQuery);

      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          page: mockQuery.page,
          size: mockQuery.size,
        }),
      );
      expect(result.data[0]).toEqual(mockUserEntity.toDto());
    });
  });

  describe('findOne', () => {
    it('should execute GetUserByIdQuery and return the user', async () => {
      const mockUserEntity = new UserEntity({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      queryBus.execute.mockResolvedValue(mockUserEntity);

      const result = await controller.findOne('user-123');

      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
        }),
      );
      expect(result).toEqual(mockUserEntity.toDto());
    });

    it('should throw NotFoundException if user does not exist', async () => {
      queryBus.execute.mockResolvedValue(null);

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should execute UpdateUserCommand and return updated user', async () => {
      const mockDto = { name: 'Updated Name' };
      const mockUserEntity = new UserEntity({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
        role: 'ADMIN',
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      commandBus.execute.mockResolvedValue(mockUserEntity);

      const result = await controller.update('user-123', mockDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
          data: mockDto,
        }),
      );
      expect(result).toEqual(mockUserEntity.toDto());
    });
  });

  describe('remove', () => {
    it('should execute DeleteUserCommand', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await controller.remove('user-123');

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
        }),
      );
    });
  });
});
