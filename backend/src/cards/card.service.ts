import { Injectable } from '@nestjs/common';
import { CardRepository } from '../repositories/card-repository';
import { Card } from '../interfaces/card.interface';
import { CreateCardDto } from './dto/create-card.dto';
import { LogService } from '../services/log.service';
import { LogAction } from '../interfaces/log.interface';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly logService: LogService
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
      null
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
}