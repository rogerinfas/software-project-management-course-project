import { AdmissionStageEntity } from '../entities/admission-stage.entity';

export abstract class IAdmissionStageRepository {
  abstract create(
    stage: Partial<AdmissionStageEntity>,
  ): Promise<AdmissionStageEntity>;
  abstract findAllWithProspects(): Promise<AdmissionStageEntity[]>;
  abstract findById(id: string): Promise<AdmissionStageEntity | null>;
  abstract update(
    id: string,
    stage: Partial<AdmissionStageEntity>,
  ): Promise<AdmissionStageEntity>;
  abstract delete(id: string): Promise<void>;
}
