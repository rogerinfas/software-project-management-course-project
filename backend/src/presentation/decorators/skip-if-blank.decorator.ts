import { Transform } from 'class-transformer';

/**
 * Decorador para saltar la validación si el campo es undefined, null o un string en blanco
 */
export function SkipIfBlank(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Transform(({ value }) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        return undefined;
      }
      return value;
    })(target, propertyKey);
  };
}
