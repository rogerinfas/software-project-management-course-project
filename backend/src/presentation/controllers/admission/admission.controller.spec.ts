import { Test, TestingModule } from '@nestjs/testing';
import { AdmissionController } from './admission.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AdmissionStageEntity } from '../../../domain/entities/admission-stage.entity';
import { ProspectEntity } from '../../../domain/entities/prospect.entity';
import { AppointmentEntity } from '../../../domain/entities/appointment.entity';
import { EvaluationResultEntity } from '../../../domain/entities/evaluation-result.entity';
import { ProspectInteractionEntity } from '../../../domain/entities/interaction.entity';
import {
  EducationalLevel,
  ProspectPriority,
  EvaluationStatus,
} from '@prisma/client';

describe('AdmissionController (Unit)', () => {
  let controller: AdmissionController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdmissionController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AdmissionController>(AdmissionController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('stages', () => {
    it('should return all stages', async () => {
      const stage = new AdmissionStageEntity({
        id: 's-1',
        name: 'Initial',
        order: 1,
      });
      queryBus.execute.mockResolvedValue([stage]);

      const result = await controller.getStages();

      expect(queryBus.execute).toHaveBeenCalled();
      expect(result).toEqual([stage.toDto()]);
    });

    it('should create a stage', async () => {
      const stage = new AdmissionStageEntity({
        id: 's-1',
        name: 'Initial',
        order: 1,
      });
      commandBus.execute.mockResolvedValue(stage);

      const result = await controller.createStage({
        name: 'Initial',
        order: 1,
      });

      expect(commandBus.execute).toHaveBeenCalled();
      expect(result).toEqual(stage.toDto());
    });

    it('should update a stage', async () => {
      const stage = new AdmissionStageEntity({
        id: 's-1',
        name: 'Updated',
        order: 1,
      });
      commandBus.execute.mockResolvedValue(stage);

      const result = await controller.updateStage('s-1', {
        name: 'Updated',
        order: 1,
      });

      expect(commandBus.execute).toHaveBeenCalled();
      expect(result).toEqual(stage.toDto());
    });

    it('should delete a stage', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await controller.deleteStage('s-1');

      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('prospects', () => {
    it('should get paginated prospects', async () => {
      const prospect = new ProspectEntity({
        id: 'p-1',
        name: 'John Doe',
        phone: '123456789',
        targetGrade: '1',
        level: EducationalLevel.PRIMARY,
        priority: ProspectPriority.HIGH,
        currentStageId: 's-1',
      });
      queryBus.execute.mockResolvedValue({
        data: [prospect],
        meta: { total: 1 },
      });

      const result = await controller.getProspects({ page: 1, size: 10 });

      expect(result.data).toEqual([prospect.toDto()]);
    });

    it('should create a prospect', async () => {
      const prospect = new ProspectEntity({
        id: 'p-1',
        name: 'John Doe',
        phone: '123456789',
        targetGrade: '1',
        level: EducationalLevel.PRIMARY,
        priority: ProspectPriority.HIGH,
        currentStageId: 's-1',
      });
      commandBus.execute.mockResolvedValue(prospect);

      const result = await controller.createProspect({
        name: 'John Doe',
        phone: '123456789',
        targetGrade: '1',
        level: EducationalLevel.PRIMARY,
        priority: ProspectPriority.HIGH,
        currentStageId: 's-1',
      });

      expect(result).toEqual(prospect.toDto());
    });

    it('should update prospect stage', async () => {
      const prospect = new ProspectEntity({
        id: 'p-1',
        name: 'John Doe',
        phone: '123456789',
        targetGrade: '1',
        level: EducationalLevel.PRIMARY,
        priority: ProspectPriority.HIGH,
        currentStageId: 's-2',
      });
      commandBus.execute.mockResolvedValue(prospect);

      const result = await controller.updateProspectStage('p-1', {
        currentStageId: 's-2',
      });

      expect(result).toEqual(prospect.toDto());
    });
  });

  describe('appointments', () => {
    it('should return all appointments', async () => {
      const date = new Date();
      const app = new AppointmentEntity({
        id: 'a-1',
        prospectId: 'p-1',
        date,
        type: 'Interview',
        notes: 'Notes',
      });
      queryBus.execute.mockResolvedValue([app]);

      const result = await controller.getAppointments();

      expect(result).toEqual([app.toDto()]);
    });

    it('should schedule appointment', async () => {
      const date = new Date();
      const app = new AppointmentEntity({
        id: 'a-1',
        prospectId: 'p-1',
        date,
        type: 'Interview',
        notes: 'Notes',
      });
      commandBus.execute.mockResolvedValue(app);

      const result = await controller.createAppointment({
        prospectId: 'p-1',
        date: date.toISOString(),
        type: 'Interview',
        notes: 'Notes',
      });

      expect(result).toEqual(app.toDto());
    });
  });

  describe('evaluation', () => {
    it('should save evaluation', async () => {
      const resultEntity = new EvaluationResultEntity({
        id: 'e-1',
        prospectId: 'p-1',
        aptitude: EvaluationStatus.FIT,
        comments: 'Good',
      });
      commandBus.execute.mockResolvedValue(resultEntity);

      const result = await controller.saveEvaluation('p-1', {
        aptitude: EvaluationStatus.FIT,
        comments: 'Good',
      });

      expect(result).toEqual(resultEntity.toDto());
    });
  });

  describe('interactions', () => {
    it('should return all interactions', async () => {
      const inter = new ProspectInteractionEntity({
        id: 'i-1',
        prospectId: 'p-1',
        type: 'Call',
        summary: 'C',
        author: 'A',
        date: new Date(),
      });
      queryBus.execute.mockResolvedValue([inter]);

      const result = await controller.getInteractions('p-1');

      expect(result).toEqual([inter.toDto()]);
    });

    it('should create interaction', async () => {
      const inter = new ProspectInteractionEntity({
        id: 'i-1',
        prospectId: 'p-1',
        type: 'Call',
        summary: 'C',
        author: 'A',
        date: new Date(),
      });
      commandBus.execute.mockResolvedValue(inter);

      const result = await controller.createInteraction('p-1', {
        type: 'Call',
        summary: 'C',
        author: 'A',
      });

      expect(result).toEqual(inter.toDto());
    });

    it('should update interaction', async () => {
      const inter = new ProspectInteractionEntity({
        id: 'i-1',
        prospectId: 'p-1',
        type: 'Call',
        summary: 'C Updated',
        author: 'A',
        date: new Date(),
      });
      commandBus.execute.mockResolvedValue(inter);

      const result = await controller.updateInteraction('i-1', {
        type: 'Call',
        summary: 'C Updated',
        author: 'A',
      });

      expect(result).toEqual(inter.toDto());
    });
  });
});
