import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entities/form.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FormsService {
  private forms: Form[] = [];

  create(createFormDto: CreateFormDto): Form {
    const form: Form = {
      id: uuidv4(),
      ...createFormDto,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.forms.push(form);
    return form;
  }

  findAll(): Form[] {
    return this.forms;
  }

  findOne(id: string): Form {
    const form = this.forms.find((f) => f.id === id);
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  update(id: string, updateFormDto: UpdateFormDto): Form {
    const index = this.forms.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    this.forms[index] = {
      ...this.forms[index],
      ...updateFormDto,
      updatedAt: Date.now(),
    };
    return this.forms[index];
  }

  remove(id: string): void {
    const index = this.forms.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    this.forms.splice(index, 1);
  }
}
