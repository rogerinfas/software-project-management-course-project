# Guia de Arquitectura y Estrategia de Pruebas del Backend

Esta guia describe la configuracion de pruebas, la suite de pruebas unitarias e integracion, el reporte de cobertura de codigo, los comandos de ejecucion y los patrones de arquitectura aplicados en el backend del proyecto.

---

## 1. Descripcion del Estado Actual de Pruebas

El sistema cuenta con un total de 294 pruebas automatizadas distribuidas en 82 suites de pruebas. La suite abarca tres niveles diferenciados de la arquitectura limpia:

* Pruebas de Dominio (Entidades): Pruebas unitarias para las 19 entidades de dominio del backend que comprueban instanciacion de constructores, metodos de fabricacion, actualizaciones de estado y transformaciones de DTO.
* Pruebas de Casos de Uso (Capa 1): Pruebas de comandos y consultas (CQRS) en todos los modulos (User, Academic, Admission, Enrollment, Staff, Treasury) que validan las reglas de negocio aisladas mediante el mockeo de repositorios.
* Pruebas de Repositorios (Capa 2): Pruebas unitarias e integracion para los 19 repositorios de Prisma mediante la inyeccion de una instancia simulada de PrismaService para verificar llamadas correctas de insercion, actualizacion, busqueda y transacciones.
* Pruebas de Controladores (Capa 3): Pruebas unitarias y de integracion HTTP de todos los controladores (UserController, AcademicController, AdmissionController, EnrollmentController, StaffController, TreasuryController) para verificar el mapeo correcto de endpoints, codigos de estado de retorno y llamadas a los buses de CQRS.
* Pruebas E2E (End-to-End): Localizadas en la carpeta test para validar flujos de integracion de extremo a extremo (registro, login, persistencia y sesion de Better Auth junto con endpoints CRUD restringidos).

---

## 2. Instrucciones de Ejecucion

Para ejecutar las pruebas en el entorno de desarrollo local, se pueden utilizar los siguientes comandos desde la raiz del directorio del backend:

### Ejecutar todas las pruebas de la aplicacion
```bash
pnpm run test
```
Este comando ejecuta todos los archivos con extension spec.ts bajo el directorio src/ y los archivos de pruebas integracion. Utiliza Jest con un transpilador personalizado en CommonJS para permitir la ejecucion limpia de dependencias escritas en modulos ESM puro (como better-auth).

### Ejecutar las pruebas con medicion de cobertura
```bash
pnpm run test:cov
```
Ejecuta la suite y genera un reporte en consola de la cobertura de sentencias, ramas, funciones y lineas, escribiendo un reporte HTML detallado en la carpeta coverage/.

### Ejecutar las pruebas E2E integradas con base de datos
```bash
pnpm run test:e2e
```
Ejecuta el archivo de pruebas de integracion extrema utilizando Supertest para simular peticiones HTTP completas a los controladores levantados.

---

## 3. Ejemplo de Prueba Unitaria

A continuacion se presenta la implementacion de la prueba unitaria para el caso de uso CreateUserCommandHandler, localizada en src/application/use-cases/user/commands/create-user.command.spec.ts:

```typescript
import { CreateUserCommand, CreateUserCommandHandler } from './create-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { EmailAlreadyExistsException } from '../../../../domain/exceptions/user.exceptions';
import { Role } from '@prisma/client';

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
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    handler = new CreateUserCommandHandler(userRepository);
  });

  it('should throw EmailAlreadyExistsException if email already exists', async () => {
    const user = new UserEntity({ email: 'test@example.com', name: 'Test User', role: Role.ADMIN });
    userRepository.findByEmail.mockResolvedValue(user);

    const command = new CreateUserCommand(user, 'password123');

    await expect(handler.execute(command)).rejects.toThrow(EmailAlreadyExistsException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should successfully create user and return user entity', async () => {
    const user = new UserEntity({ email: 'test@example.com', name: 'Test User', role: Role.ADMIN });
    userRepository.findByEmail.mockResolvedValue(null);
    mockSignUpEmail.mockResolvedValue({
      user: {
        id: 'new-id',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.ADMIN,
      },
    });

    const command = new CreateUserCommand(user, 'password123');
    const result = await handler.execute(command);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe('new-id');
  });
});
```

### Explicacion detallada del ejemplo:

1. Mockeo de Dependencias Externas: Better Auth es un modulo de terceros que realiza llamadas de red y firma criptografica. Para que la prueba sea puramente unitaria, rapida y reproducible, se intercepta la exportacion de la configuracion de auth usando jest.mock, sustituyendo auth.api.signUpEmail con una funcion espia mockSignUpEmail.
2. Setup de Hooks (beforeEach): En cada prueba, se limpia el espia de Better Auth y se instancia un repositorio simulado (userRepository) provisto de espias para las funciones basicas, pasandolo al constructor de CreateUserCommandHandler.
3. Test de Excepcion de Negocio: En la primera prueba, configuramos el espia userRepository.findByEmail para que retorne un usuario existente. Al ejecutar el comando, se comprueba que el handler lanza correctamente la excepcion de dominio EmailAlreadyExistsException y detiene la ejecucion.
4. Test de Flujo Exitoso: En la segunda prueba, indicamos al repositorio que no existe usuario previo (retornando null) y a Better Auth que retorne un usuario creado. El handler ejecuta la creacion exitosamente y devuelve una instancia valida de UserEntity.

### Ejecutar especificamente este archivo de prueba
Para ejecutar unicamente este archivo de prueba de manera directa en la consola:
```bash
pnpm run test src/application/use-cases/user/commands/create-user.command.spec.ts
```
