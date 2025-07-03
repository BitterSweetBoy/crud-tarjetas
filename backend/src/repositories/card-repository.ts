import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Card, CardDescription } from '../interfaces/card.interface';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CardRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCard(cardData: { title: string; descriptions: string[];}): Promise<Card> {
    const connection = await this.databaseService.getConnection();

    try {
      await connection.beginTransaction();

      const cardId = uuidv4();

      await connection.execute(
        'INSERT INTO cards (id, title, created_at) VALUES (?, ?, NOW())',
        [cardId, cardData.title],
      );

      for (const description of cardData.descriptions) {
        const descriptionId = uuidv4();
        await connection.execute(
          'INSERT INTO card_descriptions (id, card_id, description, created_at) VALUES (?, ?, ?, NOW())',
          [descriptionId, cardId, description],
        );
      }

      await connection.commit();

      const createdCard = await this.findById(cardId);
      if (!createdCard) {
        throw new Error('Failed to create card');
      }
      return createdCard;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: string): Promise<Card | null> {
    const [cardRows] = await this.databaseService.getPool()
      .execute<mysql.RowDataPacket[]>('SELECT * FROM cards WHERE id = ?', [id]);

    if (cardRows.length === 0) {
      return null;
    }

    const [descriptionRows] = await this.databaseService.getPool().execute<
        mysql.RowDataPacket[]>('SELECT * FROM card_descriptions WHERE card_id = ? ORDER BY created_at ASC', [id]);

    const card = cardRows[0] as Card;
    card.descriptions = descriptionRows as CardDescription[];

    return card;
  }

}
