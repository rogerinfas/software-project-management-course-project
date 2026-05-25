import {
  CreateCourseCommandHandler,
  UpdateCourseCommandHandler,
  DeleteCourseCommandHandler,
} from './course.commands';

import {
  CreateScheduleCommandHandler,
  UpdateScheduleCommandHandler,
  DeleteScheduleCommandHandler,
} from './schedule.commands';

import {
  CreateCommunicationCommandHandler,
  UpdateCommunicationCommandHandler,
  DeleteCommunicationCommandHandler,
} from './communication.commands';

import {
  CreateSectionCommandHandler,
  UpdateSectionCommandHandler,
  DeleteSectionCommandHandler,
} from './section.commands';

export * from './course.commands';
export * from './schedule.commands';
export * from './communication.commands';
export * from './section.commands';

export const AcademicCommandHandlers = [
  CreateCourseCommandHandler,
  UpdateCourseCommandHandler,
  DeleteCourseCommandHandler,
  CreateScheduleCommandHandler,
  UpdateScheduleCommandHandler,
  DeleteScheduleCommandHandler,
  CreateCommunicationCommandHandler,
  UpdateCommunicationCommandHandler,
  DeleteCommunicationCommandHandler,
  CreateSectionCommandHandler,
  UpdateSectionCommandHandler,
  DeleteSectionCommandHandler,
];
