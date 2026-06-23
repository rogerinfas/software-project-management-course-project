import {
  CreateSectionCommand,
  CreateSectionCommandHandler,
  UpdateSectionCommand,
  UpdateSectionCommandHandler,
  DeleteSectionCommand,
  DeleteSectionCommandHandler,
} from './section.commands';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { EducationalLevel } from '@prisma/client';
import { SectionNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

describe('Section Commands', () => {
  let sectionRepository: any;

  beforeEach(() => {
    sectionRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateSectionCommandHandler', () => {
    it('should create and return a section', async () => {
      const created = new SectionEntity({
        id: 's-1',
        name: 'A',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 25,
        status: 'OPEN',
      });
      sectionRepository.create.mockResolvedValue(created);

      const handler = new CreateSectionCommandHandler(sectionRepository);
      const command = new CreateSectionCommand(
        'A',
        '1',
        EducationalLevel.PRIMARY,
        25,
      );
      const result = await handler.execute(command);

      expect(result).toBe(created);
      expect(sectionRepository.create).toHaveBeenCalledWith({
        name: 'A',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 25,
        status: 'OPEN',
      });
    });
  });

  describe('UpdateSectionCommandHandler', () => {
    it('should throw SectionNotFoundException if section not found', async () => {
      sectionRepository.findById.mockResolvedValue(null);

      const handler = new UpdateSectionCommandHandler(sectionRepository);
      const command = new UpdateSectionCommand('non-existent-id', 'B');

      await expect(handler.execute(command)).rejects.toThrow(
        SectionNotFoundException,
      );
    });

    it('should update and return the updated section', async () => {
      const section = new SectionEntity({
        id: 's-1',
        name: 'A',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 25,
      });
      const updated = new SectionEntity({
        id: 's-1',
        name: 'B',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 30,
      });
      sectionRepository.findById.mockResolvedValue(section);
      sectionRepository.update.mockResolvedValue(updated);

      const handler = new UpdateSectionCommandHandler(sectionRepository);
      const command = new UpdateSectionCommand(
        's-1',
        'B',
        undefined,
        undefined,
        30,
      );
      const result = await handler.execute(command);

      expect(result).toBe(updated);
      expect(sectionRepository.update).toHaveBeenCalledWith('s-1', {
        name: 'B',
        grade: undefined,
        level: undefined,
        capacity: 30,
        status: undefined,
      });
    });
  });

  describe('DeleteSectionCommandHandler', () => {
    it('should throw SectionNotFoundException if section not found', async () => {
      sectionRepository.findById.mockResolvedValue(null);

      const handler = new DeleteSectionCommandHandler(sectionRepository);
      const command = new DeleteSectionCommand('non-existent-id');

      await expect(handler.execute(command)).rejects.toThrow(
        SectionNotFoundException,
      );
    });

    it('should delete the section if found', async () => {
      const section = new SectionEntity({
        id: 's-1',
        name: 'A',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 25,
      });
      sectionRepository.findById.mockResolvedValue(section);

      const handler = new DeleteSectionCommandHandler(sectionRepository);
      const command = new DeleteSectionCommand('s-1');
      await handler.execute(command);

      expect(sectionRepository.delete).toHaveBeenCalledWith('s-1');
    });
  });
});
