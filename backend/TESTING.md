# Guia de Arquitectura y Estrategia de Pruebas del Backend

Esta guia describe la configuracion de pruebas, la suite de pruebas unitarias e integracion, el reporte de cobertura de codigo, los comandos de ejecucion y los patrones de arquitectura aplicados en el backend del proyecto.

---

## 1. Descripcion del Estado Actual de Pruebas

El sistema cuenta con un total de 294 pruebas automatizadas distribuidas en 82 suites de pruebas. La suite abarca tres niveles de la arquitectura limpia:

* Pruebas de Dominio (Entidades): Pruebas unitarias para las 19 entidades de dominio.
* Pruebas de Casos de Uso (Capa 1): Pruebas de comandos y consultas (CQRS).
* Pruebas de Repositorios (Capa 2): Pruebas de los repositorios de Prisma con inyeccion simulada de PrismaService.
* Pruebas de Controladores (Capa 3): Pruebas unitarias y de integracion HTTP de todos los controladores.

---

## 2. Instrucciones de Ejecucion

### Ejecutar todas las pruebas de la aplicacion
```bash
pnpm run test
```

### Ejecutar las pruebas con medicion de cobertura
```bash
pnpm run test:cov
```

### Ejecutar las pruebas E2E integradas con base de datos
```bash
pnpm run test:e2e
```

---

## 3. Explicacion Detallada de Pruebas por Capas

### Capa Dominio (Entidades de Dominio)

#### ¿Que hacen las pruebas de Dominio?
Estas pruebas se centran en la logica pura del negocio. Su objetivo es asegurar que las reglas fundamentales y los datos de las entidades sean correctos e inmutables frente a factores externos.
* Validar constructores: Verifican que la entidad se cree con los atributos correctos y en el formato esperado.
* Reglas de negocio e invariantes: Comprueban comportamientos como la transicion de estados permitidos, calculos internos, validacion de campos requeridos y generacion de excepciones personalizadas de dominio.
* Mapeo y transporte: Validan metodos utilitarios como `toDto()` que preparan la entidad para ser transferida de forma segura al exterior.
* Independencia absoluta: No requieren frameworks, bases de datos ni servicios externos. Son extremadamente rapidas.

#### Ejemplo Practico y Explicado (`src/domain/entities/user.entity.spec.ts`):

```typescript
import { UserEntity } from './user.entity';
import { Role } from '@prisma/client';

describe('UserEntity', () => {
  it('debe inicializar la entidad y retornar el DTO correspondiente', () => {
    // 1. Preparar (Arrange): Definir los datos crudos con los que se creara la entidad
    const data = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'John Doe',
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 2. Actuar (Act): Instanciar la entidad pasando los datos al constructor
    const entity = new UserEntity(data);

    // 3. Afirmar (Assert): Validar que las propiedades internas se asignaron correctamente
    expect(entity.id).toBe(data.id);
    expect(entity.email).toBe(data.email);
    expect(entity.name).toBe(data.name);

    // 4. Afirmar Comportamiento: Validar que el metodo de conversion a DTO funcione adecuadamente
    const dto = entity.toDto();
    expect(dto.id).toBe(data.id);
    expect(dto.email).toBe(data.email);
    expect(dto.role).toBe(data.role);
  });
});
```

---

### Capa 1: Casos de Uso (Commands y Queries / CQRS)

#### ¿Que hacen las pruebas de Casos de Uso?
Estas pruebas validan el flujo de trabajo y la orquestacion de procesos especificos de la aplicacion (tambien llamados historias de usuario).
* Flujo procedimental: Verifican los pasos que realiza la aplicacion cuando un usuario ejecuta una accion (por ejemplo, registrarse, matricularse, emitir un pago).
* Aislamiento mediante Mocks: Como un caso de uso interactua con repositorios (bases de datos) o APIs externas (como Better Auth), se simulan (mockean) estas dependencias. Esto aisla la logica de negocio permitiendo probarla de forma predecible y veloz sin tocar la base de datos real.
* Validacion de Excepciones: Validan que se lancen los errores adecuados cuando no se cumplen las condiciones previas (por ejemplo, si un correo electronico ya esta registrado).

#### Ejemplo Practico y Explicado (`src/application/use-cases/user/commands/create-user.command.spec.ts`):

```typescript
import { CreateUserCommand, CreateUserCommandHandler } from './create-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { EmailAlreadyExistsException } from '../../../../domain/exceptions/user.exceptions';
import { Role } from '@prisma/client';

// 1. Simulacion (Mock) de dependencias externas
// Aqui interceptamos el archivo de configuracion de Better Auth para evitar que intente inicializarse
const mockSignUpEmail = jest.fn();

jest.mock('../../../../infrastructure/config/better-auth/better-auth.config', () => ({
  auth: {
    api: {
      signUpEmail: (...args: any[]) => mockSignUpEmail(...args),
    },
  },
}));

describe('CreateUserCommandHandler', () => {
  let handler: CreateUserCommandHandler;
  let userRepository: any;

  beforeEach(() => {
    mockSignUpEmail.mockReset();
    
    // 2. Preparar (Arrange): Crear un repositorio simulado (Mock Repository)
    // De esta forma evitamos realizar llamadas reales a la base de datos
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    
    // Instanciar el orquestador del caso de uso inyectando nuestra dependencia simulada
    handler = new CreateUserCommandHandler(userRepository);
  });

  it('debe lanzar EmailAlreadyExistsException si el correo ya esta registrado', async () => {
    // 2. Preparar (Arrange): Configurar el mock para simular que el correo ya existe en la BD
    const user = new UserEntity({ email: 'test@example.com', name: 'Test User', role: Role.ADMIN });
    userRepository.findByEmail.mockResolvedValue(user);

    const command = new CreateUserCommand(user, 'password123');

    // 3. Actuar y Afirmar (Act & Assert): Intentar ejecutar y comprobar que arroja la excepcion esperada
    await expect(handler.execute(command)).rejects.toThrow(EmailAlreadyExistsException);
    
    // Verificar que efectivamente el caso de uso consulto al repositorio usando el correo correcto
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('debe crear el usuario correctamente y retornar la entidad resultante', async () => {
    // 2. Preparar (Arrange): Configurar los mocks para simular exito en busqueda y en la API externa
    const user = new UserEntity({ email: 'test@example.com', name: 'Test User', role: Role.ADMIN });
    userRepository.findByEmail.mockResolvedValue(null); // Correo libre
    mockSignUpEmail.mockResolvedValue({
      user: {
        id: 'new-id',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.ADMIN,
      },
    });

    const command = new CreateUserCommand(user, 'password123');
    
    // 3. Actuar (Act): Ejecutar el caso de uso
    const result = await handler.execute(command);

    // 4. Afirmar (Assert): Validar que el resultado de la operacion cumple con lo esperado
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe('new-id');
  });
});
```

---

### Capa 2: Infraestructura (Repositorios de Prisma)

#### ¿Que hacen las pruebas de Infraestructura/Repositorio?
Estas pruebas verifican la correcta traduccion entre el dominio y la persistencia de datos (base de datos).
* Mapeo de datos: Validan que los objetos de dominio (entidades) se transformen correctamente en las estructuras requeridas por el ORM (Prisma) y viceversa.
* Comportamiento del cliente ORM: Verifican que se llamen a los metodos correctos del ORM (por ejemplo, `prisma.user.create`, `prisma.user.findUnique`) con los parametros, filtros y relaciones requeridos.
* Simulacion del Servicio de Prisma: Al inyectar un `PrismaService` simulado (mock), garantizamos que la capa de base de datos se comporte exactamente como esperamos en un entorno controlado, eliminando la necesidad de levantar bases de datos de desarrollo y agilizando las pruebas.

#### Ejemplo Practico y Explicado (`src/infrastructure/persistence/prisma/repositories/prisma-user.repository.spec.ts`):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from '../prisma.service';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Role } from '@prisma/client';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  // 1. Preparar (Arrange): Estructura simulada (Mock) de la base de datos a traves de Prisma
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Inicializar el modulo de NestJS inyectando el PrismaService mockeado
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
  });

  it('debe llamar al metodo create de prisma y retornar la entidad de dominio mapeada', async () => {
    const userData = { email: 'test@example.com', name: 'Test', role: Role.ADMIN };
    
    // Configurar el mock para simular la respuesta que daria la base de datos real
    mockPrisma.user.create.mockResolvedValue({ id: 'u-1', ...userData, emailVerified: false, image: null });

    // 2. Actuar (Act): Guardar el usuario a traves del repositorio
    const result = await repository.create(userData as any);

    // 3. Afirmar (Assert): Comprobar que el repositorio retorno una entidad limpia de dominio
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe('u-1');
    
    // Validar que se llamo a la consulta de Prisma con los campos y parametros correctos
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: false,
        image: undefined,
      },
    });
  });
});
```

---

### Capa 3: Controladores (Presentacion)

#### ¿Que hacen las pruebas de Controlador?
Las pruebas de la capa de presentacion aseguran que las rutas HTTP esten expuestas correctamente y deleguen de manera adecuada las solicitudes.
* Validacion de enrutamiento y entrada: Verifican que el controlador exponga los metodos HTTP correspondientes (GET, POST, PUT, DELETE) y reciba los objetos de transferencia de datos de entrada (DTOs).
* Despacho por bus de mensajeria (CQRS): Confirman que el controlador construya y envie el comando o consulta apropiado al bus respectivo (`CommandBus` y `QueryBus`).
* Transformacion y formateo de respuesta: Validan que el controlador convierta el resultado devuelto por la logica de negocio (usualmente una entidad) en un DTO limpio compatible con el cliente (por ejemplo, eliminando contraseñas o datos sensibles antes de enviarlo por HTTP).

#### Ejemplo Practico y Explicado (`src/presentation/controllers/user/user.controller.spec.ts`):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from '../../../domain/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    // 1. Preparar (Arrange): Crear modulo de NestJS y simular los buses de CQRS
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
  });

  it('debe despachar CreateUserCommand y retornar el DTO del usuario creado', async () => {
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
    });

    // Configurar el bus simulado para retornar la entidad creada
    commandBus.execute.mockResolvedValue(mockUserEntity);

    // 2. Actuar (Act): Invocar el metodo del controlador simulando la peticion HTTP
    const result = await controller.create(mockDto);

    // 3. Afirmar (Assert): Validar que el controlador envio la orden correcta al bus
    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        password: mockDto.password,
        user: expect.any(Object),
      }),
    );
    
    // Validar que la respuesta sea mapeada a DTO para consumo directo del frontend
    expect(result).toEqual(mockUserEntity.toDto());
  });
});
```
