import { Test, TestingModule } from '@nestjs/testing';
import { AcademicController } from './academic.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CourseEntity } from '../../../domain/entities/course.entity';
import { ScheduleEntity } from '../../../domain/entities/schedule.entity';
import { CommunicationEntity } from '../../../domain/entities/communication.entity';
import { SectionEntity } from '../../../domain/entities/section.entity';
import { EducationalLevel } from '@prisma/client';

describe('AcademicController (Unit)', () => {
  let controller: AcademicController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AcademicController>(AcademicController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Courses', () => {
    const mockCourse = {
      id: 'course-123',
      name: 'Matemáticas',
      description: 'Curso de álgebra y geometría',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should list all courses', async () => {
      queryBus.execute.mockResolvedValue([mockCourse]);
      const result = await controller.getCourses('Mat');
      expect(result[0]).toEqual(new CourseEntity(mockCourse).toDto());
    });

    it('should create a course', async () => {
      const mockEntity = new CourseEntity(mockCourse);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.createCourse({
        name: 'Matemáticas',
        description: 'Curso de álgebra y geometría',
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should update a course', async () => {
      const mockEntity = new CourseEntity(mockCourse);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.updateCourse('course-123', {
        name: 'Matemáticas 2',
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should delete a course', async () => {
      commandBus.execute.mockResolvedValue(undefined);
      await controller.deleteCourse('course-123');
      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('Schedules', () => {
    const mockSchedule = {
      id: 'sched-123',
      sectionId: 'sec-123',
      courseId: 'course-123',
      staffId: 'staff-123',
      day: 1,
      startTime: '08:00',
      endTime: '09:30',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should list schedules', async () => {
      queryBus.execute.mockResolvedValue([mockSchedule]);
      const result = await controller.getSchedules('sec-123', 'staff-123', '1');
      expect(result[0]).toEqual(new ScheduleEntity(mockSchedule).toDto());
    });

    it('should create a schedule', async () => {
      const mockEntity = new ScheduleEntity(mockSchedule);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.createSchedule({
        sectionId: 'sec-123',
        courseId: 'course-123',
        staffId: 'staff-123',
        day: 1,
        startTime: '08:00',
        endTime: '09:30',
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should update a schedule', async () => {
      const mockEntity = new ScheduleEntity(mockSchedule);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.updateSchedule('sched-123', {
        startTime: '09:00',
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should delete a schedule', async () => {
      commandBus.execute.mockResolvedValue(undefined);
      await controller.deleteSchedule('sched-123');
      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('Communications', () => {
    const mockComm = {
      id: 'comm-123',
      title: 'Feriado Escolar',
      content: 'No habrá clases el día viernes.',
      category: 'ANNOUNCEMENT',
      isVisible: true,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should list communications', async () => {
      queryBus.execute.mockResolvedValue([mockComm]);
      const result = await controller.getCommunications('ANNOUNCEMENT', 'Feriado');
      expect(result[0]).toEqual(new CommunicationEntity(mockComm).toDto());
    });

    it('should create a communication', async () => {
      const mockEntity = new CommunicationEntity(mockComm);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.createCommunication({
        title: 'Feriado Escolar',
        content: 'No habrá clases.',
        category: 'ANNOUNCEMENT',
        isVisible: true,
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should update a communication', async () => {
      const mockEntity = new CommunicationEntity(mockComm);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.updateCommunication('comm-123', {
        title: 'Feriado Escolar Actualizado',
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should delete a communication', async () => {
      commandBus.execute.mockResolvedValue(undefined);
      await controller.deleteCommunication('comm-123');
      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('Sections', () => {
    const mockSection = {
      id: 'sec-123',
      name: 'Aula A',
      grade: '1',
      level: EducationalLevel.PRIMARIA,
      capacity: 30,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      students: [],
    };

    it('should list sections', async () => {
      queryBus.execute.mockResolvedValue([mockSection]);
      const result = await controller.getSections(EducationalLevel.PRIMARIA);
      expect(result[0].id).toEqual(mockSection.id);
    });

    it('should create a section', async () => {
      const mockEntity = new SectionEntity(mockSection);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.createSection({
        name: 'Aula A',
        grade: '1',
        level: EducationalLevel.PRIMARIA,
        capacity: 30,
        status: 'ACTIVE',
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should update a section', async () => {
      const mockEntity = new SectionEntity(mockSection);
      commandBus.execute.mockResolvedValue(mockEntity);
      const result = await controller.updateSection('sec-123', {
        capacity: 35,
      });
      expect(result).toEqual(mockEntity.toDto());
    });

    it('should delete a section', async () => {
      commandBus.execute.mockResolvedValue(undefined);
      await controller.deleteSection('sec-123');
      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('Teachers', () => {
    it('should list teachers', async () => {
      const mockTeacher = { id: 'teacher-123', name: 'Prof. Juan Pérez' };
      queryBus.execute.mockResolvedValue([mockTeacher]);
      const result = await controller.getTeachers();
      expect(result[0]).toEqual(mockTeacher);
    });
  });
});
