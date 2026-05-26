import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Use Cases
import { CreateStageCommand } from '../../../application/use-cases/admission-stage/commands/create-stage.command';
import { UpdateStageCommand } from '../../../application/use-cases/admission-stage/commands/update-stage.command';
import { DeleteStageCommand } from '../../../application/use-cases/admission-stage/commands/delete-stage.command';
import { GetStagesQuery } from '../../../application/use-cases/admission-stage/queries/get-stages.query';

import { CreateProspectCommand } from '../../../application/use-cases/prospect/commands/create-prospect.command';
import { UpdateProspectStageCommand } from '../../../application/use-cases/prospect/commands/update-prospect-stage.command';
import { GetProspectsPaginatedQuery } from '../../../application/use-cases/prospect/queries/get-prospects-paginated.query';

import { CreateAppointmentCommand } from '../../../application/use-cases/appointment/commands/create-appointment.command';
import { GetAppointmentsQuery } from '../../../application/use-cases/appointment/queries/get-appointments.query';

import { SaveEvaluationCommand } from '../../../application/use-cases/evaluation-result/commands/save-evaluation.command';
import {
  CreateInteractionCommand,
  UpdateInteractionCommand,
  GetInteractionsQuery,
} from '../../../application/use-cases/interaction';

// DTOs
import {
  CreateStageRequest,
  UpdateStageRequest,
  AdmissionStageResponse,
  CreateProspectRequest,
  UpdateProspectStageRequest,
  GetProspectsPaginatedRequest,
  ProspectResponse,
  ResponsePaginatedProspectDto,
  CreateAppointmentRequest,
  AppointmentResponse,
  SaveEvaluationRequest,
  EvaluationResultResponse,
  CreateInteractionRequest,
  UpdateInteractionRequest,
  ProspectInteractionResponse,
} from './dto';

// Domain Entities
import { AdmissionStageEntity } from '../../../domain/entities/admission-stage.entity';
import { ProspectEntity } from '../../../domain/entities/prospect.entity';
import { AppointmentEntity } from '../../../domain/entities/appointment.entity';
import { EvaluationResultEntity } from '../../../domain/entities/evaluation-result.entity';
import { ProspectInteractionEntity } from '../../../domain/entities/interaction.entity';
import { PaginatedResult } from '../../../domain/repositories/prospect.repository.interface';

@ApiTags('Admission')
@Controller('admission')
export class AdmissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('stages')
  @ApiOperation({ summary: 'Get all admission stages with prospects' })
  @ApiResponse({
    status: 200,
    description: 'Return all stages.',
    type: [AdmissionStageResponse],
  })
  async getStages(): Promise<AdmissionStageResponse[]> {
    const results = await this.queryBus.execute<
      GetStagesQuery,
      AdmissionStageEntity[]
    >(new GetStagesQuery());
    return results.map((r) => r.toDto());
  }

  @Post('stages')
  @ApiOperation({ summary: 'Create a new admission stage' })
  @ApiResponse({
    status: 201,
    description: 'Stage created successfully.',
    type: AdmissionStageResponse,
  })
  async createStage(
    @Body() dto: CreateStageRequest,
  ): Promise<AdmissionStageResponse> {
    const result = await this.commandBus.execute<
      CreateStageCommand,
      AdmissionStageEntity
    >(new CreateStageCommand(dto.name, dto.order));
    return result.toDto();
  }

  @Put('stages/:id')
  @ApiOperation({ summary: 'Update an admission stage' })
  @ApiResponse({
    status: 200,
    description: 'Stage updated successfully.',
    type: AdmissionStageResponse,
  })
  async updateStage(
    @Param('id') id: string,
    @Body() dto: UpdateStageRequest,
  ): Promise<AdmissionStageResponse> {
    const result = await this.commandBus.execute<
      UpdateStageCommand,
      AdmissionStageEntity
    >(new UpdateStageCommand(id, dto.name, dto.order));
    return result.toDto();
  }

  @Delete('stages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an admission stage' })
  @ApiResponse({ status: 204, description: 'Stage deleted successfully.' })
  async deleteStage(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteStageCommand(id));
  }

  @Get('prospects')
  @ApiOperation({ summary: 'Get prospects with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated prospects.',
    type: ResponsePaginatedProspectDto,
  })
  async getProspects(
    @Query() query: GetProspectsPaginatedRequest,
  ): Promise<ResponsePaginatedProspectDto> {
    const results = await this.queryBus.execute<
      GetProspectsPaginatedQuery,
      PaginatedResult<ProspectEntity>
    >(new GetProspectsPaginatedQuery(query.page, query.size, query.search));
    return {
      data: results.data.map((r) => r.toDto()),
      meta: results.meta,
    };
  }

  @Post('prospects')
  @ApiOperation({ summary: 'Create a new prospect' })
  @ApiResponse({
    status: 201,
    description: 'Prospect created successfully.',
    type: ProspectResponse,
  })
  async createProspect(
    @Body() dto: CreateProspectRequest,
  ): Promise<ProspectResponse> {
    const result = await this.commandBus.execute<
      CreateProspectCommand,
      ProspectEntity
    >(
      new CreateProspectCommand(
        dto.name,
        dto.phone,
        dto.targetGrade,
        dto.level,
        dto.priority,
        dto.currentStageId,
      ),
    );
    return result.toDto();
  }

  @Patch('prospects/:id/stage')
  @ApiOperation({ summary: 'Update stage of a prospect' })
  @ApiResponse({
    status: 200,
    description: 'Prospect stage updated successfully.',
    type: ProspectResponse,
  })
  async updateProspectStage(
    @Param('id') id: string,
    @Body() dto: UpdateProspectStageRequest,
  ): Promise<ProspectResponse> {
    const result = await this.commandBus.execute<
      UpdateProspectStageCommand,
      ProspectEntity
    >(new UpdateProspectStageCommand(id, dto.currentStageId));
    return result.toDto();
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Get all scheduled appointments' })
  @ApiResponse({
    status: 200,
    description: 'Return all appointments.',
    type: [AppointmentResponse],
  })
  async getAppointments(): Promise<AppointmentResponse[]> {
    const results = await this.queryBus.execute<
      GetAppointmentsQuery,
      AppointmentEntity[]
    >(new GetAppointmentsQuery());
    return results.map((r) => r.toDto());
  }

  @Post('appointments')
  @ApiOperation({ summary: 'Schedule a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment scheduled successfully.',
    type: AppointmentResponse,
  })
  async createAppointment(
    @Body() dto: CreateAppointmentRequest,
  ): Promise<AppointmentResponse> {
    const result = await this.commandBus.execute<
      CreateAppointmentCommand,
      AppointmentEntity
    >(
      new CreateAppointmentCommand(
        dto.prospectId,
        new Date(dto.date),
        dto.type,
        dto.notes,
      ),
    );
    return result.toDto();
  }

  @Patch('prospects/:id/evaluation')
  @ApiOperation({ summary: 'Save evaluation result of a prospect' })
  @ApiResponse({
    status: 200,
    description: 'Evaluation saved successfully.',
    type: EvaluationResultResponse,
  })
  async saveEvaluation(
    @Param('id') id: string,
    @Body() dto: SaveEvaluationRequest,
  ): Promise<EvaluationResultResponse> {
    const result = await this.commandBus.execute<
      SaveEvaluationCommand,
      EvaluationResultEntity
    >(new SaveEvaluationCommand(id, dto.aptitude, dto.comments));
    return result.toDto();
  }

  @Get('prospects/:id/interactions')
  @ApiOperation({ summary: 'Get all interactions for a prospect' })
  @ApiResponse({
    status: 200,
    description: 'Return all interactions.',
    type: [ProspectInteractionResponse],
  })
  async getInteractions(
    @Param('id') id: string,
  ): Promise<ProspectInteractionResponse[]> {
    const results = await this.queryBus.execute<
      GetInteractionsQuery,
      ProspectInteractionEntity[]
    >(new GetInteractionsQuery(id));
    return results.map((r) => r.toDto());
  }

  @Post('prospects/:id/interactions')
  @ApiOperation({ summary: 'Create a new interaction for a prospect' })
  @ApiResponse({
    status: 201,
    description: 'Interaction created successfully.',
    type: ProspectInteractionResponse,
  })
  async createInteraction(
    @Param('id') prospectId: string,
    @Body() dto: CreateInteractionRequest,
  ): Promise<ProspectInteractionResponse> {
    const result = await this.commandBus.execute<
      CreateInteractionCommand,
      ProspectInteractionEntity
    >(
      new CreateInteractionCommand(
        prospectId,
        dto.type,
        dto.summary,
        dto.author,
      ),
    );
    return result.toDto();
  }

  @Put('interactions/:id')
  @ApiOperation({ summary: 'Update an existing interaction' })
  @ApiResponse({
    status: 200,
    description: 'Interaction updated successfully.',
    type: ProspectInteractionResponse,
  })
  async updateInteraction(
    @Param('id') id: string,
    @Body() dto: UpdateInteractionRequest,
  ): Promise<ProspectInteractionResponse> {
    const result = await this.commandBus.execute<
      UpdateInteractionCommand,
      ProspectInteractionEntity
    >(
      new UpdateInteractionCommand(
        id,
        dto.type,
        dto.summary,
        dto.author,
      ),
    );
    return result.toDto();
  }
}
