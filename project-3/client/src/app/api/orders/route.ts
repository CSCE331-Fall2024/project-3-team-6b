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

async function executeQuery(query: string, params?: any[]) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

interface OrderRequest {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
}

export async function POST(req: Request) {
  try {
    const orderData: OrderRequest = await req.json();

    // Base free items that every order gets
    const baseOrderItems = {
      free_items: [
        { id: 9, name: "Napkins", quantity: 2 },
        { id: 2, name: "Soy Sauce Packet", quantity: 1 },
        { id: 5, name: "Fortune Cookies", quantity: 1 },
        { id: 6, name: "Utensils (Forks)", quantity: 1 },
        { id: 7, name: "Utensils (Knives)", quantity: 1 },
        { id: 8, name: "Utensils (Spoons)", quantity: 1 }
      ],
      entree_side: orderData.items
        .filter(item => item.category === 'entree' || item.category === 'side')
        .map(item => ({
          id: parseInt(item.menuItemId),
          name: item.name.toLowerCase(),
          quantity: item.quantity
        }))
    };

    // Add drink_table only if there are drinks in the order
    const drinkItems = orderData.items.filter(item => item.category === 'drink');
    if (drinkItems.length > 0) {
      baseOrderItems['drink_table'] = drinkItems.map(item => ({
        id: parseInt(item.menuItemId),
        name: item.name,
        quantity: item.quantity
      }));
    }

    // Add takeout cartons for entrees
    if (baseOrderItems.entree_side.length > 0) {
      baseOrderItems.free_items.push({ id: 12, name: "Takeout Cartons", quantity: 1 });
    }

    // Start transaction
    await executeQuery('BEGIN');

    try {
      // Insert main order and return the inserted id
      const orderResult = await executeQuery(
        `INSERT INTO orders (datetime, sale, items) 
         VALUES (CURRENT_TIMESTAMP, $1, $2) 
         RETURNING id`,
        [
          Number(orderData.total.toFixed(2)), // Ensure consistent decimal places
          JSON.stringify(baseOrderItems)
        ]
      );

      const orderId = orderResult[0].id;

      // Insert all items into order_items table
      for (const item of orderData.items) {
        let itemType = '';
        if (item.category === 'entree' || item.category === 'side') {
          itemType = 'entree_side';
        } else if (item.category === 'drink') {
          itemType = 'drink_table';
        }

        if (itemType) {
          // Insert item reference
          await executeQuery(
            `INSERT INTO order_items (order_id, item_id, item_type) 
             VALUES ($1, $2, $3)`,
            [orderId, parseInt(item.menuItemId), itemType]
          );

          // Update inventory
          await executeQuery(
            `UPDATE ${itemType} 
             SET inventory = inventory - $1 
             WHERE id = $2`,
            [item.quantity, parseInt(item.menuItemId)]
          );
        }
      }

      // Insert free items
      for (const freeItem of baseOrderItems.free_items) {
        await executeQuery(
          `INSERT INTO order_items (order_id, item_id, item_type) 
           VALUES ($1, $2, 'free_items')`,
          [orderId, freeItem.id]
        );
      }

      await executeQuery('COMMIT');

      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order created successfully'
      });

    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}