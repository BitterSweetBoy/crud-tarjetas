import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardDto } from './dto/card-dto';

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

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las cards' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cards obtenida correctamente',
    type: CardDto
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener las cards'
  })
  async getAllCards() {
    return await this.cardService.getAllCards();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una card por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Card obtenida correctamente',
    type: CardDto
  })
  @ApiResponse({
    status: 404,
    description: 'Card no encontrada'
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener la card'
  })
  async getCard(@Param('id') id: string) {
    return await this.cardService.getCardById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza una card por su ID' })
  @ApiBody({
    type: UpdateCardDto,
    examples: {
      example1: {
        value: {
          title: 'Titulo actualizado',
          descriptions: [
            'Descripción Actualizada',
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Card actualizada correctamente'
  })
  @ApiResponse({
    status: 404,
    description: 'La card a Actualizar no existe'
  })
  @ApiResponse({
    status: 500,
    description: 'Error al actualizar la Card'
  })
  async updateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto){
    return await this.cardService.updateCard(id, updateCardDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una card' })
  @ApiResponse({
    status: 200,
    description: 'Card eliminada correctamente'
  })
  @ApiResponse({
    status: 404,
    description: 'La card a eliminar no existe'
  })
  @ApiResponse({
    status: 500,
    description: 'Error al eliminar la Card'
  })
  async deleteCard(@Param('id') id: string){
    return await this.cardService.deleteCard(id);
  }
}