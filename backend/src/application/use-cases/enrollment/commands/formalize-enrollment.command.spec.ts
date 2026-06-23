import {
  FormalizeEnrollmentCommand,
  FormalizeEnrollmentCommandHandler,
} from './formalize-enrollment.command';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import { EducationalLevel, EnrollmentStatus } from '@prisma/client';
import {
  SectionNotFoundException,
  NoVacanciesAvailableException,
  DeudaPendienteException,
  StudentAlreadyExistsException,
} from '../../../../domain/exceptions/enrollment-domain.exceptions';

describe('FormalizeEnrollmentCommandHandler', () => {
  let handler: FormalizeEnrollmentCommandHandler;
  let studentRepository: any;
  let guardianRepository: any;
  let sectionRepository: any;
  let enrollmentRepository: any;

  beforeEach(() => {
    studentRepository = {
      findByDni: jest.fn(),
      create: jest.fn(),
    };
    guardianRepository = {
      findByDni: jest.fn(),
      create: jest.fn(),
    };
    sectionRepository = {
      findById: jest.fn(),
    };
    enrollmentRepository = {
      create: jest.fn(),
    };
    handler = new FormalizeEnrollmentCommandHandler(
      studentRepository,
      guardianRepository,
      sectionRepository,
      enrollmentRepository,
    );
  });

  it('should throw SectionNotFoundException if section not found', async () => {
    sectionRepository.findById.mockResolvedValue(null);
    const command = new FormalizeEnrollmentCommand(
      'John',
      'Doe',
      '12345678',
      EducationalLevel.PRIMARY,
      '1',
      'sec-1',
      '87654321',
      'Guardian',
      '987654321',
    );

    await expect(handler.execute(command)).rejects.toThrow(
      SectionNotFoundException,
    );
  });

  it('should throw NoVacanciesAvailableException if capacity is reached', async () => {
    sectionRepository.findById.mockResolvedValue({
      id: 'sec-1',
      capacity: 25,
      students: new Array(25),
    });
    const command = new FormalizeEnrollmentCommand(
      'John',
      'Doe',
      '12345678',
      EducationalLevel.PRIMARY,
      '1',
      'sec-1',
      '87654321',
      'Guardian',
      '987654321',
    );

    await expect(handler.execute(command)).rejects.toThrow(
      NoVacanciesAvailableException,
    );
  });

  it('should throw StudentAlreadyExistsException if student exists by DNI', async () => {
    sectionRepository.findById.mockResolvedValue({
      id: 'sec-1',
      capacity: 25,
      students: [],
    });
    studentRepository.findByDni.mockResolvedValue({});
    const command = new FormalizeEnrollmentCommand(
      'John',
      'Doe',
      '12345678',
      EducationalLevel.PRIMARY,
      '1',
      'sec-1',
      '87654321',
      'Guardian',
      '987654321',
    );

    await expect(handler.execute(command)).rejects.toThrow(
      StudentAlreadyExistsException,
    );
  });

  it('should throw DeudaPendienteException if guardian DNI ends with 99', async () => {
    sectionRepository.findById.mockResolvedValue({
      id: 'sec-1',
      capacity: 25,
      students: [],
    });
    studentRepository.findByDni.mockResolvedValue(null);
    const command = new FormalizeEnrollmentCommand(
      'John',
      'Doe',
      '12345678',
      EducationalLevel.PRIMARY,
      '1',
      'sec-1',
      '12345699',
      'Guardian',
      '987654321',
    );

    await expect(handler.execute(command)).rejects.toThrow(
      DeudaPendienteException,
    );
  });

  it('should successfully formalize enrollment', async () => {
    sectionRepository.findById.mockResolvedValue({
      id: 'sec-1',
      capacity: 25,
      students: [],
    });
    studentRepository.findByDni.mockResolvedValue(null);
    guardianRepository.findByDni.mockResolvedValue({ id: 'g-1' });
    studentRepository.create.mockResolvedValue({ id: 's-1' });
    const enrollment = new EnrollmentEntity({
      id: 'e-1',
      studentId: 's-1',
      year: 2026,
      status: EnrollmentStatus.ACTIVE,
      pdfUrl: 'url',
    });
    enrollmentRepository.create.mockResolvedValue(enrollment);

    const command = new FormalizeEnrollmentCommand(
      'John',
      'Doe',
      '12345678',
      EducationalLevel.PRIMARY,
      '1',
      'sec-1',
      '87654321',
      'Guardian',
      '987654321',
    );
    const result = await handler.execute(command);

    expect(result).toBe(enrollment);
  });
});
