import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CardRepository } from '../repositories/card-repository';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { LogService } from '../services/log.service';
import { LogRepository } from 'src/repositories';

@Module({
  controllers: [CardController],
  providers: [DatabaseService, CardRepository, CardService, LogService, LogRepository],
  exports: [CardRepository, CardService],
})
export class CardsModule {}
