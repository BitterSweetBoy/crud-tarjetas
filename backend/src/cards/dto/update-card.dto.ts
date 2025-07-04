import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, MaxLength } from 'class-validator';

export class UpdateCardDto {
  @ApiPropertyOptional({
    description: 'El título de la tarjeta',
    maxLength: 255,
    example: 'Título de ejemplo',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

   @ApiPropertyOptional({
    description: 'Lista de descripciones asociadas a la tarjeta',
    type: [String],
    example: ['Descripción 1', 'Otra descripción'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  descriptions?: string[];
}