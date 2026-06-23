import { AdmissionStageEntity } from '../entities/admission-stage.entity';

export interface IAdmissionStageRepository {
  create(
    stage: Partial<AdmissionStageEntity>,
  ): Promise<AdmissionStageEntity>;
  findAllWithProspects(): Promise<AdmissionStageEntity[]>;
  findById(id: string): Promise<AdmissionStageEntity | null>;
  update(
    id: string,
    stage: Partial<AdmissionStageEntity>,
  ): Promise<AdmissionStageEntity>;
  delete(id: string): Promise<void>;
}
