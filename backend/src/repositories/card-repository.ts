import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Card, CardDescription } from '../interfaces/card.interface';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { CardDescriptionDto, CardDto } from '../cards/dto/card.dto';

@Injectable()
export class CardRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCard(cardData: {
    title: string;
    descriptions: string[];
  }): Promise<CardDto> {
    const connection = await this.databaseService.getConnection();

    try {
      await connection.beginTransaction();

      const cardId = uuidv4();

      await connection.execute(
        'INSERT INTO cards (id, title, created_at, is_active) VALUES (?, ?, NOW(), TRUE)',
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
        throw new Error('Error al crear la card');
      }

      return createdCard;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: string): Promise<CardDto | null> {
    if (!id) throw new Error('El Id es inválido');

    const [rows] = await this.databaseService
      .getPool()
      .execute<mysql.RowDataPacket[]>(
        `SELECT 
        c.id,
        c.title,
        c.created_at,
        cd.id AS description_id,
        cd.description,
        cd.created_at AS description_created_at
      FROM cards c
      LEFT JOIN card_descriptions cd ON c.id = cd.card_id
      WHERE c.is_active = TRUE AND c.id = ?
      ORDER BY cd.created_at ASC`,
        [id],
      );

    if (rows.length === 0) return null;

    const card: CardDto = {
      id: rows[0].id,
      title: rows[0].title,
      created_at: rows[0].created_at,
      descriptions: rows
        .filter((row) => row.description_id)
        .map(
          (row): CardDescriptionDto => ({
            id: row.description_id,
            description: row.description,
            created_at: row.description_created_at,
          }),
        ),
    };

    return card;
  }

  async findAllPaginated(opts: {
    limit: number;
    offset: number;
  }): Promise<CardDto[]> {
    const { limit, offset } = opts;
    
    // Validar que son números enteros positivos
    const limitInt = Math.max(1, parseInt(limit.toString(), 10));
    const offsetInt = Math.max(0, parseInt(offset.toString(), 10));
    
    const [rows] = await this.databaseService
      .getPool()
      .query<mysql.RowDataPacket[]>(
        `SELECT 
           c.id,
           c.title,
           c.created_at,
           cd.id AS description_id,
           cd.description,
           cd.created_at AS description_created_at
         FROM cards c
         LEFT JOIN card_descriptions cd 
           ON c.id = cd.card_id
         WHERE c.is_active = TRUE
         ORDER BY c.created_at DESC, cd.created_at ASC
         LIMIT ${limitInt} OFFSET ${offsetInt}`,
      );
    const cardsMap = new Map<string, CardDto>();
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
        cardsMap.get(row.id)!.descriptions.push({
          id: row.description_id,
          description: row.description,
          created_at: row.description_created_at,
        } as CardDescriptionDto);
      }
    }
    return Array.from(cardsMap.values());
  }

  async updateCard(
    id: string,
    updateData: { title?: string; descriptions?: string[] },
  ): Promise<CardDto> {
    const connection = await this.databaseService.getConnection();

    try {
      await connection.beginTransaction();

      const [existingRows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM cards WHERE id = ? AND is_active = TRUE',
        [id],
      );

      if (existingRows.length === 0) {
        throw new Error('La card a actualizar no existe');
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
        throw new Error('Error al actualizar la card');
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
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async countActiveCards(): Promise<number> {
    const [rows] = await this.databaseService
      .getPool()
      .execute<mysql.RowDataPacket[]>(
        `SELECT COUNT(*) AS count
         FROM cards c
         WHERE c.is_active = TRUE`,
      );
    return rows[0].count;
  }
}
