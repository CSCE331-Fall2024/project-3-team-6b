// src/app/api/customer-orders/route.ts
import { NextResponse } from 'next/server';
import { Pool, PoolConfig } from 'pg';
import { OrderItem } from '@/types';

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

interface CustomerOrderRequest {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export async function POST(req: Request) {
  const client = await pool.connect();
  
  try {
    const orderData: CustomerOrderRequest = await req.json();
    
    await client.query('BEGIN');

    // Group items by type and combine quantities
    const groupedItems = orderData.items.reduce((acc, item) => {
      const key = `${item.menuItemId}_${item.category}`;
      if (!acc[key]) {
        acc[key] = { ...item, quantity: 0 };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {} as Record<string, OrderItem>);

    // Format order details
    const orderDetails = {
      free_items: [
        { id: 9, name: "Napkins", quantity: 2 },
        { id: 2, name: "Soy Sauce Packet", quantity: 1 },
        { id: 5, name: "Fortune Cookies", quantity: 1 },
        { id: 6, name: "Utensils (Forks)", quantity: 1 },
        { id: 7, name: "Utensils (Knives)", quantity: 1 },
        { id: 8, name: "Utensils (Spoons)", quantity: 1 },
        { id: 12, name: "Takeout Cartons", quantity: 1 }
      ],
      entree_side: [] as any[],
      drink_table: [] as any[]
    };

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (datetime, sale, items) 
       VALUES (CURRENT_TIMESTAMP, $1, $2::jsonb) 
       RETURNING id`,
      [orderData.total, orderDetails]
    );

    const orderId = orderResult.rows[0].id;

    // Process each grouped item
    for (const item of Object.values(groupedItems)) {
      let tableName;
      switch (item.category) {
        case 'entree':
        case 'side':
          tableName = 'entree_side';
          orderDetails.entree_side.push({
            id: parseInt(item.menuItemId),
            name: item.name.toLowerCase(),
            quantity: item.quantity
          });
          break;
        case 'drink':
          tableName = 'drink_table';
          orderDetails.drink_table.push({
            id: parseInt(item.menuItemId),
            name: item.name.toLowerCase(),
            quantity: item.quantity
          });
          break;
        case 'appetizer':
          tableName = 'appetizers';
          break;
        default:
          continue;
      }

      // Update inventory with combined quantity
      await client.query(
        `UPDATE ${tableName} 
         SET inventory = inventory - $1 
         WHERE id = $2`,
        [item.quantity, parseInt(item.menuItemId)]
      );

      // Single insert into order_items for each unique item
      await client.query(
        `INSERT INTO order_items (order_id, item_id, item_type) 
         VALUES ($1, $2, $3)`,
        [orderId, parseInt(item.menuItemId), tableName]
      );
    }

    // Insert free items
    for (const freeItem of orderDetails.free_items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_id, item_type) 
         VALUES ($1, $2, 'free_items')`,
        [orderId, freeItem.id]
      );
    }

    // Update the order with final details
    await client.query(
      `UPDATE orders 
       SET items = $1::jsonb 
       WHERE id = $2`,
      [orderDetails, orderId]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order processed successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}