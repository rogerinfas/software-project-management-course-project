import { DomainException } from './domain-exception';

export class ProspectAlreadyApprovedException extends DomainException {
  constructor(prospectId: string) {
    super(
      `El postulante ya cuenta con un dictamen final de APTO y su evaluación no puede ser modificada.`,
      'PROSPECT_ALREADY_APPROVED',
    );
  }
}
