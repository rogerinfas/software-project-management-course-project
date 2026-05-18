import { Transform } from 'class-transformer';

/**
 * Transforma strings en blanco (ej. '   ') a undefined para evitar que pasen validadores de string vacíos si no son requeridos,
 * o para que fallen los validadores IsNotEmpty() correctamente.
 */
export function TransformDirtyBlank(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Transform(({ value }) => {
      if (typeof value === 'string' && value.trim() === '') {
        return undefined;
      }
      return value;
    })(target, propertyKey);
  };
}
