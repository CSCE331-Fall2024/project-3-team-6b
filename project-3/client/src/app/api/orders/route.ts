// src/app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { query } from '@/server/db/config';

export async function POST(req: Request) {
  try {
    const order = await req.json();
    
    // Start a transaction
    await query('BEGIN');
    
    try {
      // First, insert the main order
      const orderResult = await query(
        `INSERT INTO orders (order_date, total_price, order_details) 
         VALUES ($1, $2, $3) 
         RETURNING order_id`,
        [new Date(), order.total, JSON.stringify({
          entree_side: order.items.filter(item => 
            item.category === 'entree' || item.category === 'side'
          ),
          drink_table: order.items.filter(item => 
            item.category === 'drink'
          ),
          appetizers: order.items.filter(item => 
            item.category === 'appetizer'
          ),
          free_items: [] // Add any free items like utensils, napkins etc.
        })]
      );
      
      const orderId = orderResult.rows[0].order_id;
      
      // Insert order items with proper categorization
      for (const item of order.items) {
        let itemType: string;
        
        switch (item.category) {
          case 'entree':
          case 'side':
            itemType = 'entree_side';
            break;
          case 'drink':
            itemType = 'drink_table';
            break;
          case 'appetizer':
            itemType = 'appetizers';
            break;
          default:
            continue;
        }
        
        // Insert into order_items table
        await query(
          `INSERT INTO order_items (order_id, item_id, item_type) 
           VALUES ($1, $2, $3)`,
          [orderId, item.menuItemId, itemType]
        );
        
        // Update inventory (if needed)
        await query(
          `UPDATE ${itemType} 
           SET inventory = inventory - $1 
           WHERE id = $2`,
          [item.quantity, item.menuItemId]
        );
      }
      
      // Add default free items (utensils, napkins, etc.)
      const defaultFreeItems = [
        { id: 9, name: 'Napkins', quantity: 2 },
        { id: 2, name: 'Soy Sauce Packet', quantity: 1 },
        { id: 5, name: 'Fortune Cookies', quantity: 1 }
      ];
      
      for (const freeItem of defaultFreeItems) {
        await query(
          `INSERT INTO order_items (order_id, item_id, item_type) 
           VALUES ($1, $2, 'free_items')`,
          [orderId, freeItem.id]
        );
      }
      
      await query('COMMIT');
      
      return NextResponse.json({ 
        success: true, 
        orderId,
        message: 'Order created successfully' 
      });
      
    } catch (error) {
      await query('ROLLBACK');
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