import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GuardianEntity } from '../../../domain/entities/guardian.entity';
import { StudentEntity } from '../../../domain/entities/student.entity';
import { SectionEntity } from '../../../domain/entities/section.entity';
import { EnrollmentEntity } from '../../../domain/entities/enrollment.entity';
import { EducationalLevel } from '@prisma/client';

describe('EnrollmentController (Unit)', () => {
  let controller: EnrollmentController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
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

    controller = module.get<EnrollmentController>(EnrollmentController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('guardians', () => {
    it('should return paginated guardians', async () => {
      const guardian = new GuardianEntity({
        id: 'g-1',
        dni: '12345678',
        name: 'G Name',
        phone: '987654321',
      });
      queryBus.execute.mockResolvedValue({
        data: [guardian],
        meta: { total: 1 },
      });

      const result = await controller.getGuardians({ page: 1, size: 10 });

      expect(result.data).toEqual([guardian.toDto()]);
    });

    it('should create guardian', async () => {
      const guardian = new GuardianEntity({
        id: 'g-1',
        dni: '12345678',
        name: 'G Name',
        phone: '987654321',
      });
      commandBus.execute.mockResolvedValue(guardian);

      const result = await controller.createGuardian({
        dni: '12345678',
        name: 'G Name',
        phone: '987654321',
      });

      expect(result).toEqual(guardian.toDto());
    });

    it('should update guardian', async () => {
      const guardian = new GuardianEntity({
        id: 'g-1',
        dni: '12345678',
        name: 'G Name Updated',
        phone: '987654321',
      });
      commandBus.execute.mockResolvedValue(guardian);

      const result = await controller.updateGuardian('g-1', {
        dni: '12345678',
        name: 'G Name Updated',
        phone: '987654321',
      });

      expect(result).toEqual(guardian.toDto());
    });

    it('should delete guardian', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await controller.deleteGuardian('g-1');

      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('students', () => {
    it('should return paginated students', async () => {
      const student = new StudentEntity({
        id: 'stud-1',
        code: 'c-1',
        firstName: 'John',
        lastName: 'Doe',
        dni: '12345678',
        level: EducationalLevel.PRIMARY,
        grade: '1',
        guardianId: 'g-1',
      });
      queryBus.execute.mockResolvedValue({
        data: [student],
        meta: { total: 1 },
      });

      const result = await controller.getStudents({ page: 1, size: 10 });

      expect(result.data).toEqual([student.toDto()]);
    });
  });

  describe('sections', () => {
    it('should return all sections with vacancies count', async () => {
      const section = new SectionEntity({
        id: 's-1',
        name: 'A',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 25,
      });
      section.students = [];
      queryBus.execute.mockResolvedValue([section]);

      const result = await controller.getSections();

      expect(result).toEqual([{ ...section.toDto(), matriculados: 0 }]);
    });
  });

  describe('formalize', () => {
    it('should formalize enrollment successfully', async () => {
      const enrollment = new EnrollmentEntity({
        id: 'e-1',
        studentId: 'stud-1',
        year: 2026,
        status: 'activa',
        pdfUrl: 'pdf',
      });
      commandBus.execute.mockResolvedValue(enrollment);

      const result = await controller.formalizeEnrollment({
        firstName: 'John',
        lastName: 'Doe',
        dni: '12345678',
        level: EducationalLevel.PRIMARY,
        grade: '1',
        sectionId: 'sec-1',
        guardianDni: '87654321',
        guardianName: 'Guardian',
        guardianPhone: '987654321',
      });

      expect(result).toEqual(enrollment.toDto());
    });
  });

  describe('documents', () => {
    it('should return paginated enrollment documents', async () => {
      const enrollment = new EnrollmentEntity({
        id: 'e-1',
        studentId: 'stud-1',
        year: 2026,
        status: 'activa',
        pdfUrl: 'pdf',
      });
      queryBus.execute.mockResolvedValue({
        data: [enrollment],
        meta: { total: 1 },
      });

      const result = await controller.getDocuments({ page: 1, size: 10 });

      expect(result.data).toEqual([enrollment.toDto()]);
    });
  });
});
