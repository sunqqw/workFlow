import { ApiProperty } from '@nestjs/swagger';

export class Workflow {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: [Object] })
  nodes: any[];

  @ApiProperty({ type: [Object] })
  edges: any[];

  @ApiProperty({ type: Object })
  viewport: { x: number; y: number; zoom: number };

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
