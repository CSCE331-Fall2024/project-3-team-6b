// server/src/tests/db.test.ts

import { db } from '../config/db';

async function testDatabaseConnection() {
  try {
    // Test basic connection
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Database connection test failed');
    }

    // Test a simple query
    const result = await db.query('SELECT * FROM entree_side LIMIT 1');
    console.log('Sample query result:', result.rows[0]);

    // Test a more complex query
    const inventoryResult = await db.query(`
      SELECT 
        name,
        inventory,
        retail_price
      FROM entree_side
      WHERE inventory < 100
      ORDER BY inventory ASC
      LIMIT 5
    `);
    console.log('Low inventory items:', inventoryResult.rows);

  } catch (error) {
    console.error('Database tests failed:', error);
  } finally {
    // Close the connection pool
    await db.close();
  }
}

// Run the tests
testDatabaseConnection();