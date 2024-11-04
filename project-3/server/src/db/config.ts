import { Pool } from 'pg';

const pool = new Pool({
  user: 'team_6b',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'team_6b_db',
  password: 'kartana',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Database connected successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default pool;