import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsArray()
  nodes: any[];

  @ApiProperty()
  @IsArray()
  edges: any[];

  @ApiProperty()
  @IsObject()
  viewport: { x: number; y: number; zoom: number };
}
