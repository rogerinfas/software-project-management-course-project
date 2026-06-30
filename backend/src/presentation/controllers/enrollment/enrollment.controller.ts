import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Commands & Queries
import { CreateGuardianCommand } from '../../../application/use-cases/enrollment/commands/create-guardian.command';
import { UpdateGuardianCommand } from '../../../application/use-cases/enrollment/commands/update-guardian.command';
import { DeleteGuardianCommand } from '../../../application/use-cases/enrollment/commands/delete-guardian.command';
import { FormalizeEnrollmentCommand } from '../../../application/use-cases/enrollment/commands/formalize-enrollment.command';
import { CreateStudentFromProspectCommand } from '../../../application/use-cases/enrollment/commands/create-student-from-prospect.command';
import { AssignGuardianToStudentCommand } from '../../../application/use-cases/enrollment/commands/assign-guardian-to-student.command';
import { EnrollStudentCommand } from '../../../application/use-cases/enrollment/commands/enroll-student.command';

import { GetGuardiansQuery } from '../../../application/use-cases/enrollment/queries/get-guardians.query';
import { GetStudentsQuery } from '../../../application/use-cases/enrollment/queries/get-students.query';
import { GetSectionsQuery } from '../../../application/use-cases/enrollment/queries/get-sections.query';
import { GetEnrollmentDocumentsQuery } from '../../../application/use-cases/enrollment/queries/get-enrollment-documents.query';

// DTOs
import {
  CreateGuardianRequest,
  UpdateGuardianRequest,
  GetGuardiansPaginatedRequest,
  GuardianResponse,
  StudentResponse,
  SectionResponse,
  FormalizeEnrollmentRequest,
  EnrollmentResponse,
  PaginatedGuardiansResponse,
  PaginatedStudentsResponse,
  PaginatedEnrollmentsResponse,
  CreateStudentFromProspectRequest,
  AssignGuardianToStudentRequest,
  EnrollStudentRequest,
} from './dto';

// Domain Entities
import { GuardianEntity } from '../../../domain/entities/guardian.entity';
import { StudentEntity } from '../../../domain/entities/student.entity';
import { SectionEntity } from '../../../domain/entities/section.entity';
import { EnrollmentEntity } from '../../../domain/entities/enrollment.entity';
import { PaginatedResult } from '../../../domain/repositories/prospect.repository.interface';

@ApiTags('Enrollment (Matrícula)')
@Controller('enrollment')
export class EnrollmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ────────────────────────────────────────────────────────────────────────────
  // APODERADOS
  // ────────────────────────────────────────────────────────────────────────────

  @Get('guardians')
  @ApiOperation({
    summary: 'List apoderados (guardians) with pagination and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated guardians.',
    type: PaginatedGuardiansResponse,
  })
  async getGuardians(
    @Query() query: GetGuardiansPaginatedRequest,
  ): Promise<PaginatedResult<GuardianResponse>> {
    const results = await this.queryBus.execute<
      GetGuardiansQuery,
      PaginatedResult<GuardianEntity>
    >(new GetGuardiansQuery(query.page, query.size, query.search));
    return {
      data: results.data.map((r) => r.toDto()),
      meta: results.meta,
    };
  }

  @Post('guardians')
  @ApiOperation({ summary: 'Create a new guardian' })
  @ApiResponse({
    status: 201,
    description: 'Guardian created successfully.',
    type: GuardianResponse,
  })
  async createGuardian(
    @Body() dto: CreateGuardianRequest,
  ): Promise<GuardianResponse> {
    const result = await this.commandBus.execute<
      CreateGuardianCommand,
      GuardianEntity
    >(
      new CreateGuardianCommand(
        dto.dni,
        dto.name,
        dto.phone,
        dto.email,
        dto.occupation,
      ),
    );
    return result.toDto();
  }

  @Put('guardians/:id')
  @ApiOperation({ summary: 'Update an existing guardian' })
  @ApiResponse({
    status: 200,
    description: 'Guardian updated successfully.',
    type: GuardianResponse,
  })
  async updateGuardian(
    @Param('id') id: string,
    @Body() dto: UpdateGuardianRequest,
  ): Promise<GuardianResponse> {
    const result = await this.commandBus.execute<
      UpdateGuardianCommand,
      GuardianEntity
    >(
      new UpdateGuardianCommand(
        id,
        dto.dni,
        dto.name,
        dto.phone,
        dto.email,
        dto.occupation,
      ),
    );
    return result.toDto();
  }

  @Delete('guardians/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a guardian' })
  @ApiResponse({ status: 204, description: 'Guardian deleted successfully.' })
  async deleteGuardian(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteGuardianCommand(id));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ESTUDIANTES
  // ────────────────────────────────────────────────────────────────────────────

  @Get('students')
  @ApiOperation({
    summary: 'List enrolled students with pagination and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated students.',
    type: PaginatedStudentsResponse,
  })
  async getStudents(
    @Query() query: GetGuardiansPaginatedRequest,
  ): Promise<PaginatedResult<StudentResponse>> {
    const results = await this.queryBus.execute<
      GetStudentsQuery,
      PaginatedResult<StudentEntity>
    >(new GetStudentsQuery(query.page, query.size, query.search));
    return {
      data: results.data.map((r) => r.toDto()),
      meta: results.meta,
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECCIONES (AULAS Y VACANTES)
  // ────────────────────────────────────────────────────────────────────────────

  @Get('sections')
  @ApiOperation({ summary: 'List all academic sections with vacancy count' })
  @ApiResponse({
    status: 200,
    description: 'Return all sections.',
    type: [SectionResponse],
  })
  async getSections(): Promise<SectionResponse[]> {
    const results = await this.queryBus.execute<
      GetSectionsQuery,
      SectionEntity[]
    >(new GetSectionsQuery());
    return results.map((s) => {
      const plain = new SectionEntity(s).toDto();
      (plain as any).matriculados = s.students?.length ?? 0;
      return plain as any;
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // FORMALIZAR MATRÍCULA
  // ────────────────────────────────────────────────────────────────────────────

  @Post('formalize')
  @ApiOperation({
    summary:
      'Formalize a student enrollment (registers student, guardian & enrollment)',
  })
  @ApiResponse({
    status: 201,
    description: 'Enrollment completed successfully.',
    type: EnrollmentResponse,
  })
  async formalizeEnrollment(
    @Body() dto: FormalizeEnrollmentRequest,
  ): Promise<EnrollmentResponse> {
    const result = await this.commandBus.execute<
      FormalizeEnrollmentCommand,
      EnrollmentEntity
    >(
      new FormalizeEnrollmentCommand(
        dto.firstName,
        dto.lastName,
        dto.dni,
        dto.level,
        dto.grade,
        dto.sectionId,
        dto.guardianDni,
        dto.guardianName,
        dto.guardianPhone,
        dto.guardianEmail,
        dto.guardianOccupation,
      ),
    );
    return result.toDto();
  }

  @Post('formalization/student')
  @ApiOperation({ summary: 'Create a student profile from a prospect' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully.',
    type: StudentResponse,
  })
  async createStudentFromProspect(
    @Body() dto: CreateStudentFromProspectRequest,
  ): Promise<StudentResponse> {
    const result = await this.commandBus.execute<
      CreateStudentFromProspectCommand,
      StudentEntity
    >(
      new CreateStudentFromProspectCommand(
        dto.prospectId,
        dto.dni,
        dto.firstName,
        dto.lastName,
        dto.level,
        dto.grade,
      ),
    );
    return result.toDto();
  }

  @Post('formalization/guardian')
  @ApiOperation({ summary: 'Assign or create a guardian for an existing student' })
  @ApiResponse({
    status: 201,
    description: 'Guardian assigned successfully.',
    type: GuardianResponse,
  })
  async assignGuardianToStudent(
    @Body() dto: AssignGuardianToStudentRequest,
  ): Promise<GuardianResponse> {
    const result = await this.commandBus.execute<
      AssignGuardianToStudentCommand,
      GuardianEntity
    >(
      new AssignGuardianToStudentCommand(
        dto.studentId,
        dto.guardianDni,
        dto.guardianName,
        dto.guardianPhone,
        dto.guardianEmail,
        dto.guardianOccupation,
      ),
    );
    return result.toDto();
  }

  @Post('formalization/section')
  @ApiOperation({ summary: 'Enroll an existing student into a section' })
  @ApiResponse({
    status: 201,
    description: 'Student enrolled successfully.',
    type: EnrollmentResponse,
  })
  async assignSectionToStudent(
    @Body() dto: EnrollStudentRequest,
  ): Promise<EnrollmentResponse> {
    const result = await this.commandBus.execute<
      EnrollStudentCommand,
      EnrollmentEntity
    >(
      new EnrollStudentCommand(
        dto.studentId,
        dto.sectionId,
      ),
    );
    return result.toDto();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // DOCUMENTOS Y EXPEDIENTES
  // ────────────────────────────────────────────────────────────────────────────

  @Get('documents')
  @ApiOperation({
    summary: 'List all academic enrollment documents/records paginated',
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated documents.',
    type: PaginatedEnrollmentsResponse,
  })
  async getDocuments(
    @Query() query: GetGuardiansPaginatedRequest,
  ): Promise<PaginatedResult<EnrollmentResponse>> {
    const results = await this.queryBus.execute<
      GetEnrollmentDocumentsQuery,
      PaginatedResult<EnrollmentEntity>
    >(new GetEnrollmentDocumentsQuery(query.page, query.size, query.search));
    return {
      data: results.data.map((r) => r.toDto()),
      meta: results.meta,
    };
  }
}
