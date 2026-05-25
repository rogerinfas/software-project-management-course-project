import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EducationalLevel } from '@prisma/client';

// Commands & Queries
import {
  CreateCourseCommand,
  UpdateCourseCommand,
  DeleteCourseCommand,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  DeleteScheduleCommand,
  CreateCommunicationCommand,
  UpdateCommunicationCommand,
  DeleteCommunicationCommand,
  CreateSectionCommand,
  UpdateSectionCommand,
  DeleteSectionCommand,
} from '../../../application/use-cases/academic/commands';

import {
  GetCoursesQuery,
  GetSchedulesQuery,
  GetCommunicationsQuery,
  GetTeachersQuery,
  GetSectionsQuery,
} from '../../../application/use-cases/academic/queries';

// DTOs
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseResponse,
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleResponse,
  CreateCommunicationDto,
  UpdateCommunicationDto,
  CommunicationResponse,
  CreateSectionDto,
  UpdateSectionDto,
  SectionResponse,
} from './dto';

// Domain Entities
import { CourseEntity } from '../../../domain/entities/course.entity';
import { ScheduleEntity } from '../../../domain/entities/schedule.entity';
import { CommunicationEntity } from '../../../domain/entities/communication.entity';
import { SectionEntity } from '../../../domain/entities/section.entity';

@ApiTags('Academic (Gestión Académica y Comunicación)')
@Controller('academic')
export class AcademicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ────────────────────────────────────────────────────────────────────────────
  // CURSOS / MATERIAS (Course)
  // ────────────────────────────────────────────────────────────────────────────

  @Get('courses')
  @ApiOperation({ summary: 'List all academic courses' })
  @ApiResponse({ status: 200, description: 'Return list of courses.', type: [CourseResponse] })
  async getCourses(@Query('search') search?: string): Promise<CourseResponse[]> {
    const results = await this.queryBus.execute<GetCoursesQuery, any[]>(
      new GetCoursesQuery(search),
    );
    return results.map((c) => new CourseEntity(c).toDto() as CourseResponse);
  }

  @Post('courses')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.', type: CourseResponse })
  async createCourse(@Body() dto: CreateCourseDto): Promise<CourseResponse> {
    const result = await this.commandBus.execute<CreateCourseCommand, CourseEntity>(
      new CreateCourseCommand(dto.name, dto.description),
    );
    return result.toDto() as CourseResponse;
  }

  @Patch('courses/:id')
  @ApiOperation({ summary: 'Update an existing course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully.', type: CourseResponse })
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ): Promise<CourseResponse> {
    const result = await this.commandBus.execute<UpdateCourseCommand, CourseEntity>(
      new UpdateCourseCommand(id, dto.name, dto.description),
    );
    return result.toDto() as CourseResponse;
  }

  @Delete('courses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 204, description: 'Course deleted successfully.' })
  async deleteCourse(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteCourseCommand(id));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // HORARIOS (Schedule)
  // ────────────────────────────────────────────────────────────────────────────

  @Get('schedules')
  @ApiOperation({ summary: 'List weekly class schedules with filters' })
  @ApiResponse({ status: 200, description: 'Return schedules list.', type: [ScheduleResponse] })
  async getSchedules(
    @Query('sectionId') sectionId?: string,
    @Query('staffId') staffId?: string,
    @Query('day') day?: string,
  ): Promise<ScheduleResponse[]> {
    const parsedDay = day ? parseInt(day, 10) : undefined;
    const results = await this.queryBus.execute<GetSchedulesQuery, any[]>(
      new GetSchedulesQuery(sectionId, staffId, parsedDay),
    );
    return results.map((s) => new ScheduleEntity(s).toDto() as ScheduleResponse);
  }

  @Post('schedules')
  @ApiOperation({ summary: 'Create a new schedule assignment' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully.', type: ScheduleResponse })
  async createSchedule(@Body() dto: CreateScheduleDto): Promise<ScheduleResponse> {
    const result = await this.commandBus.execute<CreateScheduleCommand, ScheduleEntity>(
      new CreateScheduleCommand(
        dto.sectionId,
        dto.courseId,
        dto.staffId,
        dto.day,
        dto.startTime,
        dto.endTime,
      ),
    );
    return result.toDto() as ScheduleResponse;
  }

  @Patch('schedules/:id')
  @ApiOperation({ summary: 'Update an existing schedule assignment' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully.', type: ScheduleResponse })
  async updateSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
  ): Promise<ScheduleResponse> {
    const result = await this.commandBus.execute<UpdateScheduleCommand, ScheduleEntity>(
      new UpdateScheduleCommand(
        id,
        dto.sectionId,
        dto.courseId,
        dto.staffId,
        dto.day,
        dto.startTime,
        dto.endTime,
      ),
    );
    return result.toDto() as ScheduleResponse;
  }

  @Delete('schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a schedule assignment' })
  @ApiResponse({ status: 204, description: 'Schedule deleted successfully.' })
  async deleteSchedule(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteScheduleCommand(id));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // COMUNICADOS (Communication)
  // ────────────────────────────────────────────────────────────────────────────

  @Get('communications')
  @ApiOperation({ summary: 'List all visible announcements/communications' })
  @ApiResponse({ status: 200, description: 'Return communications.', type: [CommunicationResponse] })
  async getCommunications(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<CommunicationResponse[]> {
    const results = await this.queryBus.execute<GetCommunicationsQuery, any[]>(
      new GetCommunicationsQuery(category, search),
    );
    return results.map((c) => new CommunicationEntity(c).toDto() as CommunicationResponse);
  }

  @Post('communications')
  @ApiOperation({ summary: 'Create a new announcement' })
  @ApiResponse({ status: 201, description: 'Announcement created successfully.', type: CommunicationResponse })
  async createCommunication(@Body() dto: CreateCommunicationDto): Promise<CommunicationResponse> {
    const result = await this.commandBus.execute<CreateCommunicationCommand, CommunicationEntity>(
      new CreateCommunicationCommand(
        dto.title,
        dto.content,
        dto.category,
        dto.isVisible,
        dto.expiresAt ? new Date(dto.expiresAt) : null,
      ),
    );
    return result.toDto() as CommunicationResponse;
  }

  @Patch('communications/:id')
  @ApiOperation({ summary: 'Update an existing announcement' })
  @ApiResponse({ status: 200, description: 'Announcement updated successfully.', type: CommunicationResponse })
  async updateCommunication(
    @Param('id') id: string,
    @Body() dto: UpdateCommunicationDto,
  ): Promise<CommunicationResponse> {
    const result = await this.commandBus.execute<UpdateCommunicationCommand, CommunicationEntity>(
      new UpdateCommunicationCommand(
        id,
        dto.title,
        dto.content,
        dto.category,
        dto.isVisible,
        dto.expiresAt ? new Date(dto.expiresAt) : null,
      ),
    );
    return result.toDto() as CommunicationResponse;
  }

  @Delete('communications/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiResponse({ status: 204, description: 'Announcement deleted successfully.' })
  async deleteCommunication(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteCommunicationCommand(id));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECCIONES (AULAS Y VACANTES)
  // ────────────────────────────────────────────────────────────────────────────

  @Get('sections')
  @ApiOperation({ summary: 'List all sections with student count' })
  @ApiResponse({ status: 200, description: 'Return all sections.', type: [SectionResponse] })
  async getSections(@Query('level') level?: EducationalLevel): Promise<SectionResponse[]> {
    const results = await this.queryBus.execute<GetSectionsQuery, any[]>(
      new GetSectionsQuery(level),
    );
    return results.map((s) => {
      const plain = new SectionEntity(s).toDto() as any;
      plain.matriculados = s.students?.length ?? 0;
      return plain;
    });
  }

  @Post('sections')
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({ status: 201, description: 'Section created successfully.', type: SectionResponse })
  async createSection(@Body() dto: CreateSectionDto): Promise<SectionResponse> {
    const result = await this.commandBus.execute<CreateSectionCommand, SectionEntity>(
      new CreateSectionCommand(
        dto.name,
        dto.grade,
        dto.level,
        dto.capacity,
        dto.status,
      ),
    );
    return result.toDto() as SectionResponse;
  }

  @Patch('sections/:id')
  @ApiOperation({ summary: 'Update an existing section' })
  @ApiResponse({ status: 200, description: 'Section updated successfully.', type: SectionResponse })
  async updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
  ): Promise<SectionResponse> {
    const result = await this.commandBus.execute<UpdateSectionCommand, SectionEntity>(
      new UpdateSectionCommand(
        id,
        dto.name,
        dto.grade,
        dto.level,
        dto.capacity,
        dto.status,
      ),
    );
    return result.toDto() as SectionResponse;
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a section' })
  @ApiResponse({ status: 204, description: 'Section deleted successfully.' })
  async deleteSection(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteSectionCommand(id));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // DOCENTES
  // ────────────────────────────────────────────────────────────────────────────

  @Get('teachers')
  @ApiOperation({ summary: 'List all academic teachers (staff profiles)' })
  @ApiResponse({ status: 200, description: 'Return all teachers.' })
  async getTeachers(): Promise<any[]> {
    const results = await this.queryBus.execute<GetTeachersQuery, any[]>(
      new GetTeachersQuery(),
    );
    return results;
  }
}
