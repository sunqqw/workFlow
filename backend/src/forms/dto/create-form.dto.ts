import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateFormDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsObject()
  config: {
    labelPosition: 'top' | 'left' | 'right';
    submitText: string;
    layout: 'single' | 'double';
  };

  @ApiProperty()
  @IsArray()
  fields: any[];
}
