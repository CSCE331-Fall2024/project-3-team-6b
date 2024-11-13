// src/app/api/reports/utils.ts
import db from '@/server/config/db';

export async function executeQuery(query: string, params?: any[]) {
  try {
    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}