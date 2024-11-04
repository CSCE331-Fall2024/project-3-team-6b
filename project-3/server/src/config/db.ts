import { Pool, QueryResult } from 'pg';

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'team_6b',
      host: 'csce-315-db.engr.tamu.edu',
      database: 'team_6b_db',
      password: 'kartana',
      port: 5432,
      ssl: {
        rejectUnauthorized: false
      }
    });

    this.pool.on('connect', () => {
      console.log('Database connected successfully.');
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

const db = new Database();
export default db;