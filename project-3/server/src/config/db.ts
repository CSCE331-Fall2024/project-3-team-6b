// server/src/config/db.ts

import { Pool, PoolConfig, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: PoolConfig = {
  user: process.env.POSTGRES_USER || 'team_6b',
  host: process.env.POSTGRES_HOST || 'csce-315-db.engr.tamu.edu',
  database: process.env.POSTGRES_DB || 'team_6b_db',
  password: process.env.POSTGRES_PASSWORD || 'kartana',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
};

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool(dbConfig);

    // Error handling
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Test database connection
  public async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Execute a query with error handling and logging
  public async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', {
        text,
        duration,
        rows: result.rowCount
      });
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // Get a client from the pool
  public async getClient() {
    return await this.pool.connect();
  }

  // Close the pool
  public async close() {
    await this.pool.end();
  }
}

// Export singleton instance
export const db = Database.getInstance();
export default db;