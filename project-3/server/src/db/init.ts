import { testConnection } from './config';

export async function initializeDatabase() {
  try {
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('Failed to establish database connection');
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}