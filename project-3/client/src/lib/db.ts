import { Pool, PoolConfig } from 'pg';

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

const pool = new Pool(dbConfig);

export async function executeQuery(query: string, params?: any[]) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;