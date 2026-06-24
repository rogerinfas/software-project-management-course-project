# Guía de Arquitectura y Estrategia de Pruebas del Backend

Esta guía describe la configuración de pruebas, la suite de pruebas unitarias e integración, el reporte de cobertura de código, los comandos de ejecución y los patrones de arquitectura aplicados en el backend del proyecto.

---

## 1. Descripción del Estado de Pruebas

La suite de pruebas abarca los dos niveles clave de la arquitectura limpia donde reside la lógica orquestada y de persistencia:

*   **Pruebas de Casos de Uso (Capa de Aplicación):** Pruebas de comandos y consultas (CQRS) en `src/application/use-cases/`.
*   **Pruebas de Repositorios (Capa de Infraestructura):** Pruebas de los repositorios de Prisma con inyección simulada de `PrismaService` en `src/infrastructure/persistence/prisma/repositories/`.

---

## 2. Instrucciones de Ejecución

### Ejecutar todas las pruebas de la aplicación
```bash
pnpm run test
```

### Ejecutar las pruebas con medición de cobertura
```bash
pnpm run test:cov
```

### Ejecutar las pruebas E2E integradas con base de datos
```bash
pnpm run test:e2e
```

---

## 3. Explicación Detallada de Pruebas por Capas

### Capa 1: Casos de Uso (Commands y Queries / CQRS)

#### ¿Qué hacen las pruebas de Casos de Uso?
Estas pruebas validan el flujo de trabajo y la orquestación de procesos específicos de la aplicación (también llamados historias de usuario).
*   **Flujo procedimental:** Verifican los pasos que realiza la aplicación cuando un usuario ejecuta una acción (por ejemplo, registrarse, matricularse, emitir un pago).
*   **Aislamiento mediante Mocks:** Como un caso de uso interactúa con repositorios (bases de datos) o APIs externas (como Better Auth), se simulan (mockean) estas dependencias. Esto aísla la lógica de negocio permitiendo probarla de forma predecible y veloz sin tocar la base de datos real.
*   **Validación de Excepciones:** Validan que se lancen los errores adecuados cuando no se cumplen las condiciones previas (por ejemplo, si un correo electrónico ya está registrado).

#### Ejemplo Práctico y Explicado (`src/application/use-cases/user/commands/create-user.command.spec.ts`):

```typescript
import { CreateUserCommand, CreateUserCommandHandler } from './create-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { EmailAlreadyExistsException } from '../../../../domain/exceptions/user.exceptions';
import { Role } from '@prisma/client';

// 1. Simulación (Mock) de dependencias externas
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
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    
    // Instanciar el orquestador del caso de uso inyectando nuestra dependencia simulada
    handler = new CreateUserCommandHandler(userRepository);
  });

  it('debe lanzar EmailAlreadyExistsException si el correo ya está registrado', async () => {
    const user = new UserEntity({ email: 'test@example.com', name: 'Test User', role: Role.ADMIN });
    userRepository.findByEmail.mockResolvedValue(user);

    const command = new CreateUserCommand(user, 'password123');

    await expect(handler.execute(command)).rejects.toThrow(EmailAlreadyExistsException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
```

---

### Capa 2: Infraestructura (Repositorios de Prisma)

#### ¿Qué hacen las pruebas de Infraestructura/Repositorio?
Estas pruebas verifican la correcta traducción entre el dominio y la persistencia de datos (base de datos).
*   **Mapeo de datos:** Validan que los objetos de dominio (entidades) se transformen correctamente en las estructuras requeridas por el ORM (Prisma) y viceversa.
*   **Comportamiento del cliente ORM:** Verifican que se llamen a los métodos correctos del ORM (por ejemplo, `prisma.user.create`, `prisma.user.findUnique`) con los parámetros, filtros y relaciones requeridos.
*   **Simulación del Servicio de Prisma:** Al inyectar un `PrismaService` simulado (mock), garantizamos que la capa de base de datos se comporte exactamente como esperamos en un entorno controlado, eliminando la necesidad de levantar bases de datos de desarrollo y agilizando las pruebas.

#### Ejemplo Práctico y Explicado (`src/infrastructure/persistence/prisma/repositories/prisma-user.repository.spec.ts`):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from '../prisma.service';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Role } from '@prisma/client';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  // 1. Preparar (Arrange): Estructura simulada (Mock) de la base de datos a través de Prisma
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
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

  it('debe llamar al método create de prisma y retornar la entidad de dominio mapeada', async () => {
    const userData = { email: 'test@example.com', name: 'Test', role: Role.ADMIN };
    mockPrisma.user.create.mockResolvedValue({ id: 'u-1', ...userData, emailVerified: false, image: null });

    const result = await repository.create(userData as any);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe('u-1');
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
