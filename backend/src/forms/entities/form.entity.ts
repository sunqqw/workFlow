import { ApiProperty } from '@nestjs/swagger';

export class Form {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: Object })
  config: {
    labelPosition: 'top' | 'left' | 'right';
    submitText: string;
    layout: 'single' | 'double';
  };

  @ApiProperty({ type: [Object] })
  fields: any[];

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
