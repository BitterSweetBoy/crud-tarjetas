import { Injectable } from '@nestjs/common';
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
      const logId = uuidv4();
      
      await connection.execute(
        `INSERT INTO user_logs (id, user_id, action, entity_type, entity_id, old_data, new_data, ip_address, user_agent, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          logId,
          logData.action,
          logData.entity_type,
          logData.entity_id,
          logData.old_data ? JSON.stringify(logData.old_data) : null,
          logData.new_data ? JSON.stringify(logData.new_data) : null,
        ]
      );
    } catch (error) {
    } finally {
      connection.release();
    }
  }

  async findAllLogs(limit: number = 100, offset: number = 0): Promise<CardLog[]> {
    const [rows] = await this.databaseService.getPool().execute<mysql.RowDataPacket[]>(
      `SELECT * FROM user_logs 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows.map(row => ({
      ...row,
      old_data: row.old_data ? JSON.parse(row.old_data) : null,
      new_data: row.new_data ? JSON.parse(row.new_data) : null
    })) as CardLog[];
  }

  async findLogsByEntity(entityType: string, entityId: string): Promise<CardLog[]> {
    const [rows] = await this.databaseService.getPool().execute<mysql.RowDataPacket[]>(
      `SELECT * FROM user_logs 
       WHERE entity_type = ? AND entity_id = ?
       ORDER BY created_at DESC`,
      [entityType, entityId]
    );

    return rows.map(row => ({
      ...row,
      old_data: row.old_data ? JSON.parse(row.old_data) : null,
      new_data: row.new_data ? JSON.parse(row.new_data) : null
    })) as CardLog[];
  }
}