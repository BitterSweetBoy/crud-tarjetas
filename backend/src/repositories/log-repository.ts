import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CardLog } from '../interfaces/log.interface';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createLog(logData: Omit<CardLog, 'id' | 'created_at'>): Promise<void> {
    const connection = await this.databaseService.getConnection();

    try {
      await connection.beginTransaction();

      const logId = uuidv4();
      await connection.execute(
        `INSERT INTO cards_logs
         (id, action, entity_type, entity_id, old_data, new_data, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          logId,
          logData.action,
          logData.entity_type,
          logData.entity_id,
          logData.old_data ? JSON.stringify(logData.old_data) : null,
          logData.new_data ? JSON.stringify(logData.new_data) : null,
        ],
      );
      await connection.commit();
    } catch {
      await connection.rollback();
      throw new InternalServerErrorException('No se pudo crear el log');
    } finally {
      connection.release();
    }
  }

  async findAllLogs(limit = 100, offset = 0): Promise<CardLog[]> {
    const limitInt = Math.max(1, parseInt(limit.toString(), 10));
    const offsetInt = Math.max(0, parseInt(offset.toString(), 10));

    const [rows] = await this.databaseService
      .getPool()
      .query<mysql.RowDataPacket[]>(
        `SELECT id, action, entity_type, entity_id, old_data, new_data, created_at
         FROM cards_logs
         ORDER BY created_at DESC
         LIMIT ${limitInt} OFFSET ${offsetInt}`,
      );

    return rows.map((row) => ({
      id: row.id,
      action: row.action,
      entity_type: row.entity_type,
      entity_id: row.entity_id,
      old_data: row.old_data ? JSON.parse(row.old_data) : null,
      new_data: row.new_data ? JSON.parse(row.new_data) : null,
      created_at: new Date(row.created_at),
    }));
  }

  async findLogsByEntity(
    entityType: string,
    entityId: string,
  ): Promise<CardLog[]> {
    const [rows] = await this.databaseService
      .getPool()
      .execute<mysql.RowDataPacket[]>(
        `SELECT id, action, entity_type, entity_id, old_data, new_data, created_at
         FROM cards_logs
         WHERE entity_type = ? AND entity_id = ?
         ORDER BY created_at DESC`,
        [entityType, entityId],
      );

    return rows.map((row) => ({
      id: row.id,
      action: row.action,
      entity_type: row.entity_type,
      entity_id: row.entity_id,
      old_data: row.old_data ? JSON.parse(row.old_data) : null,
      new_data: row.new_data ? JSON.parse(row.new_data) : null,
      created_at: new Date(row.created_at),
    }));
  }
}
