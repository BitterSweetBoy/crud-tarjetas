import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CardRepository } from '../repositories/card-repository';
import { Card } from '../interfaces/card.interface';
import { CreateCardDto } from './dto/create-card.dto';
import { LogService } from '../services/log.service';
import { LogAction } from '../interfaces/log.interface';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardDto } from './dto/card.dto';
import { PaginatedCardsDto } from './dto/paginated-cards.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly logService: LogService,
  ) {}

  async createCard(createCardDto: CreateCardDto): Promise<CardDto> {
    try {
      const card = await this.cardRepository.createCard(createCardDto);
      await this.logService.logCardOperation(
        LogAction.CREATE,
        card.id!,
        card,
        null,
      );
      return card;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la card');
    }
  }

  async getAllCards(pagination: {
    page: number;
    limit: number;
  }): Promise<PaginatedCardsDto> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    try {
      const total = await this.cardRepository.countActiveCards();
      const data = await this.cardRepository.findAllPaginated({
        limit,
        offset,
      });

      return { page, limit, total, data };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las cards paginadas',
      );
    }
  }

  async getCardById(id: string): Promise<CardDto> {
    if (!id) throw new BadRequestException('No se ha proporcionado un Id');

    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundException('Card no encontrada');
    }
    return card;
  }

  async updateCard(id: string, updateCardDto: UpdateCardDto): Promise<CardDto> {
    if (!id) throw new BadRequestException('No se ha proporcionado un Id');

    const oldCard = await this.cardRepository.findById(id);
    if (!oldCard) {
      throw new NotFoundException('La card a actualizar no fue encontrada');
    }

    try {
      const updatedCard = await this.cardRepository.updateCard(
        id,
        updateCardDto,
      );

      await this.logService.logCardOperation(
        LogAction.UPDATE,
        id,
        {
          title: updatedCard.title,
          descriptions: updatedCard.descriptions,
        },
        {
          title: oldCard.title,
          descriptions: oldCard.descriptions,
        },
      );

      return updatedCard;
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la card');
    }
  }

  async deleteCard(id: string): Promise<void> {
    if (!id) throw new BadRequestException('No se ha proporcionado un Id');

    const oldCard = await this.cardRepository.findById(id);
    if (!oldCard) {
      throw new NotFoundException('La card a eliminar no fue encontrada');
    }

    try {
      await this.cardRepository.desactivateCard(id);

      await this.logService.logCardOperation(
        LogAction.DELETE,
        id,
        {},
        {
          title: oldCard.title,
          descriptions: oldCard.descriptions,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la card');
    }
  }
}
