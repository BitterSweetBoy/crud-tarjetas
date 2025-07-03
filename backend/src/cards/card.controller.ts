import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva card' })
  @ApiBody({
    type: CreateCardDto, 
    examples: {
      example1: {
        value: {
          title: 'Card Title', 
          descriptions: [
            'Primera descripcion',
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente'
  })
  @ApiResponse({
    status: 400,
    description: 'Error al crear el la card'
  })
  async createCard(@Body() createCardDto: CreateCardDto) {
    return await this.cardService.createCard(createCardDto);
  }
}