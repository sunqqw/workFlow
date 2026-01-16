import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Form } from './entities/form.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('forms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form' })
  @ApiResponse({ status: 201, description: 'The form has been successfully created.', type: Form })
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all forms' })
  @ApiResponse({ status: 200, description: 'Return all forms.', type: [Form] })
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by id' })
  @ApiResponse({ status: 200, description: 'Return the form.', type: Form })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a form' })
  @ApiResponse({ status: 200, description: 'The form has been successfully updated.', type: Form })
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a form' })
  @ApiResponse({ status: 200, description: 'The form has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }
}
