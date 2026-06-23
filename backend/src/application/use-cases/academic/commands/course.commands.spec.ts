import {
  CreateCourseCommand,
  CreateCourseCommandHandler,
  UpdateCourseCommand,
  UpdateCourseCommandHandler,
  DeleteCourseCommand,
  DeleteCourseCommandHandler,
} from './course.commands';
import { CourseEntity } from '../../../../domain/entities/course.entity';
import {
  CourseNotFoundException,
  CourseAlreadyExistsException,
} from '../../../../domain/exceptions/academic-domain.exceptions';

describe('Course Commands', () => {
  let courseRepository: any;

  beforeEach(() => {
    courseRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateCourseCommandHandler', () => {
    it('should throw CourseAlreadyExistsException if name is taken', async () => {
      const existing = new CourseEntity({ id: 'c-1', name: 'Math' });
      courseRepository.findByName.mockResolvedValue(existing);

      const handler = new CreateCourseCommandHandler(courseRepository);
      const command = new CreateCourseCommand('Math', 'Description');

      await expect(handler.execute(command)).rejects.toThrow(
        CourseAlreadyExistsException,
      );
    });

    it('should create and return a course entity', async () => {
      const created = new CourseEntity({
        id: 'c-1',
        name: 'Math',
        description: 'Description',
      });
      courseRepository.findByName.mockResolvedValue(null);
      courseRepository.create.mockResolvedValue(created);

      const handler = new CreateCourseCommandHandler(courseRepository);
      const command = new CreateCourseCommand('Math', 'Description');
      const result = await handler.execute(command);

      expect(result).toBe(created);
      expect(courseRepository.create).toHaveBeenCalledWith({
        name: 'Math',
        description: 'Description',
      });
    });
  });

  describe('UpdateCourseCommandHandler', () => {
    it('should throw CourseNotFoundException if course not found', async () => {
      courseRepository.findById.mockResolvedValue(null);

      const handler = new UpdateCourseCommandHandler(courseRepository);
      const command = new UpdateCourseCommand('non-existent-id', 'Math');

      await expect(handler.execute(command)).rejects.toThrow(
        CourseNotFoundException,
      );
    });

    it('should throw CourseAlreadyExistsException if new name is already taken by another course', async () => {
      const course = new CourseEntity({ id: 'c-1', name: 'Math' });
      const otherCourse = new CourseEntity({ id: 'c-2', name: 'Science' });
      courseRepository.findById.mockResolvedValue(course);
      courseRepository.findByName.mockResolvedValue(otherCourse);

      const handler = new UpdateCourseCommandHandler(courseRepository);
      const command = new UpdateCourseCommand('c-1', 'Science');

      await expect(handler.execute(command)).rejects.toThrow(
        CourseAlreadyExistsException,
      );
    });

    it('should update and return the updated course', async () => {
      const course = new CourseEntity({ id: 'c-1', name: 'Math' });
      const updated = new CourseEntity({ id: 'c-1', name: 'Math II' });
      courseRepository.findById.mockResolvedValue(course);
      courseRepository.findByName.mockResolvedValue(null);
      courseRepository.update.mockResolvedValue(updated);

      const handler = new UpdateCourseCommandHandler(courseRepository);
      const command = new UpdateCourseCommand('c-1', 'Math II', 'New Desc');
      const result = await handler.execute(command);

      expect(result).toBe(updated);
      expect(courseRepository.update).toHaveBeenCalledWith('c-1', {
        name: 'Math II',
        description: 'New Desc',
      });
    });
  });

  describe('DeleteCourseCommandHandler', () => {
    it('should throw CourseNotFoundException if not found', async () => {
      courseRepository.findById.mockResolvedValue(null);

      const handler = new DeleteCourseCommandHandler(courseRepository);
      const command = new DeleteCourseCommand('non-existent-id');

      await expect(handler.execute(command)).rejects.toThrow(
        CourseNotFoundException,
      );
    });

    it('should delete course if found', async () => {
      const course = new CourseEntity({ id: 'c-1', name: 'Math' });
      courseRepository.findById.mockResolvedValue(course);

      const handler = new DeleteCourseCommandHandler(courseRepository);
      const command = new DeleteCourseCommand('c-1');
      await handler.execute(command);

      expect(courseRepository.delete).toHaveBeenCalledWith('c-1');
    });
  });
});
