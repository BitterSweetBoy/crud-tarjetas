import { Injectable, NotFoundException } from '@nestjs/common';
import { CardRepository } from '../repositories/card-repository';
import { Card } from '../interfaces/card.interface';
import { CreateCardDto } from './dto/create-card.dto';
import { LogService } from '../services/log.service';
import { LogAction } from '../interfaces/log.interface';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly logService: LogService,
  ) {}

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const card = await this.cardRepository.createCard(createCardDto);
    if (!card) {
      throw new Error('Error al crear la card');
    }
    await this.logService.logCardOperation(
      LogAction.CREATE,
      card.id!,
      card,
      null,
    );
    return card;
  }

  async getAllCards(): Promise<Card[]> {
    const cards = await this.cardRepository.findAll();
    if (!cards) {
      throw new Error('Error al obtener las cards');
    }
    return cards;
  }

  async getCardById(id: string): Promise<Card | null> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new Error('Card no encontrada');
    }
    return card;
  }

  async updateCard(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
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
      throw new NotFoundException('Card not found');
    }
  }

  async deleteCard(id: string): Promise<void> {
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
      if (error.message === 'Card not found') {
        throw new NotFoundException('Card no encontrada');
      }
      throw error;
    }
  }
}
