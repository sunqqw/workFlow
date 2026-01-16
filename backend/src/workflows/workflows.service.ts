import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Workflow } from './entities/workflow.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkflowsService {
  private workflows: Workflow[] = [];

  create(createWorkflowDto: CreateWorkflowDto): Workflow {
    const workflow: Workflow = {
      id: uuidv4(),
      ...createWorkflowDto,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.workflows.push(workflow);
    return workflow;
  }

  findAll(): Workflow[] {
    return this.workflows;
  }

  findOne(id: string): Workflow {
    const workflow = this.workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  update(id: string, updateWorkflowDto: UpdateWorkflowDto): Workflow {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    this.workflows[index] = {
      ...this.workflows[index],
      ...updateWorkflowDto,
      updatedAt: Date.now(),
    };
    return this.workflows[index];
  }

  remove(id: string): void {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    this.workflows.splice(index, 1);
  }
}
