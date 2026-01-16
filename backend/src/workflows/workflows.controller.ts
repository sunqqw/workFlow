import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Workflow } from './entities/workflow.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('workflows')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'The workflow has been successfully created.', type: Workflow })
  create(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowsService.create(createWorkflowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({ status: 200, description: 'Return all workflows.', type: [Workflow] })
  findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workflow by id' })
  @ApiResponse({ status: 200, description: 'Return the workflow.', type: Workflow })
  @ApiResponse({ status: 404, description: 'Workflow not found.' })
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiResponse({ status: 200, description: 'The workflow has been successfully updated.', type: Workflow })
  update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowsService.update(id, updateWorkflowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiResponse({ status: 200, description: 'The workflow has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(id);
  }
}
