import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ArrayMinSize, MaxLength } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    name: 'Title',
    type: String,
    required: true,
    description: 'Titulo de la card',
  })
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({
    name: 'Descriptions',
    type: [String],
    required: true,
    description: 'Lista de descripciones de la card',
  })
  descriptions: string[];
}