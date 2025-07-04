import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Card, CardDescription } from '../interfaces/card.interface';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CardRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCard(cardData: {
    title: string;
    descriptions: string[];
  }): Promise<Card> {
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
    const [cardRows] = await this.databaseService
      .getPool()
      .execute<mysql.RowDataPacket[]>('SELECT * FROM cards WHERE id = ?', [id]);

    if (cardRows.length === 0) {
      return null;
    }

    const [descriptionRows] = await this.databaseService
      .getPool()
      .execute<
        mysql.RowDataPacket[]
      >('SELECT * FROM card_descriptions WHERE card_id = ? ORDER BY created_at ASC', [id]);

    const card = cardRows[0] as Card;
    card.descriptions = descriptionRows as CardDescription[];

    return card;
  }

  async findAll(): Promise<Card[]> {
    const [rows] = await this.databaseService
      .getPool()
      .execute<mysql.RowDataPacket[]>(
        `SELECT c.id, c.title, c.created_at, cd.id as description_id, cd.description, cd.created_at as description_created_at
      FROM cards c
      LEFT JOIN card_descriptions cd ON c.id = cd.card_id
      ORDER BY c.created_at DESC, cd.created_at ASC`,
      );

    const cardsMap = new Map<string, Card>();

    for (const row of rows) {
      if (!cardsMap.has(row.id)) {
        cardsMap.set(row.id, {
          id: row.id,
          title: row.title,
          created_at: row.created_at,
          descriptions: [],
        });
      }

      if (row.description_id) {
        cardsMap.get(row.id)!.descriptions!.push({
          id: row.description_id,
          card_id: row.id,
          description: row.description,
          created_at: row.description_created_at,
        });
      }
    }
    return Array.from(cardsMap.values());
  }

  async updateCard(
    id: string,
    updateData: { title?: string; descriptions?: string[] },
  ): Promise<Card> {
    const connection = await this.databaseService.getConnection();
    try {
      await connection.beginTransaction();
      const [existingRows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM cards WHERE id = ?',
        [id],
      );

      if (existingRows.length === 0) {
        throw new Error('Card not found');
      }

      if (updateData.title) {
        await connection.execute('UPDATE cards SET title = ? WHERE id = ?', [
          updateData.title,
          id,
        ]);
      }

      if (updateData.descriptions) {
        await connection.execute(
          'DELETE FROM card_descriptions WHERE card_id = ?',
          [id],
        );
        for (const description of updateData.descriptions) {
          const descriptionId = uuidv4();
          await connection.execute(
            'INSERT INTO card_descriptions (id, card_id, description, created_at) VALUES (?, ?, ?, NOW())',
            [descriptionId, id, description],
          );
        }
      }
      await connection.commit();
      const updatedCard = await this.findById(id);
      if (!updatedCard) {
        throw new Error('Failed to update card');
      }
      return updatedCard;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async desactivateCard(id: string): Promise<void> {
    const connection = await this.databaseService.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(
        'UPDATE cards SET is_active = FALSE WHERE id = ?',
        [id],
      );
      if (result.affectedRows === 0) {
        throw new Error('Card not found');
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
