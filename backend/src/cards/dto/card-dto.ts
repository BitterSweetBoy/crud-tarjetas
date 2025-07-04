import { ApiProperty } from '@nestjs/swagger';

export class CardDescriptionDto {
  @ApiProperty({
    name: 'Id',
    type: String,
    example: 'a1b2c3d4-5678-1234-abcd-9876543210ef',
    description: 'Identificador único de la descripción',
  })
  id: string;

  @ApiProperty({
    name: 'Description',
    type: String,
    example: 'Nueva descripción',
    description: 'Texto descriptivo de la card',
  })
  description: string;

  @ApiProperty({
    name: 'CreatedAt',
    type: String,
    example: '2025-07-03T22:43:46.000Z',
    description: 'Fecha de creación de la descripción',
  })
  created_at: Date;
}

export class CardDto {
  @ApiProperty({
    name: 'Id',
    type: String,
    example: 'b5c5c874-294e-4517-912e-27fdd4db58d1',
    description: 'Identificador único de la card',
  })
  id: string;

  @ApiProperty({
    name: 'Title',
    type: String,
    example: 'Card Title',
    description: 'Título de la card',
  })
  title: string;

  @ApiProperty({
    name: 'CreatedAt',
    type: String,
    example: '2025-07-03T22:43:46.000Z',
    description: 'Fecha de creación de la card',
  })
  created_at: Date;

  @ApiProperty({
    name: 'Descriptions',
    type: [CardDescriptionDto],
    description: 'Lista de descripciones asociadas a la card',
  })
  descriptions: CardDescriptionDto[];
}
