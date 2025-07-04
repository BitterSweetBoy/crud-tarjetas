import { ApiProperty } from '@nestjs/swagger';
import { CardDto } from './card.dto';

export class PaginatedCardsDto {
  @ApiProperty({ example: 1, description: 'Página actual' })
  readonly page: number;

  @ApiProperty({ example: 10, description: 'Items por página' })
  readonly limit: number;

  @ApiProperty({ example: 42, description: 'Total de registros disponibles' })
  readonly total: number;

  @ApiProperty({
    type: [CardDto],
    description: 'Array de cards en esta página',
  })
  readonly data: CardDto[];
}
