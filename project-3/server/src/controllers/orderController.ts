import { Request, Response } from 'express';
import db from '../config/db'; 

interface MenuItem {
  id: number;
  type: string;
}

// Initialize menuItemMap
let menuItemMap: Record<string, MenuItem> = {};

// Function to load menu items from the database
async function loadMenuItems() {
  try {
    const result = await db.query(`
      SELECT id, LOWER(TRIM(name)) as name, 'entree_side' as type FROM entree_side
      UNION ALL
      SELECT id, LOWER(TRIM(name)) as name, 'drink_table' as type FROM drink_table
      UNION ALL
      SELECT id, LOWER(TRIM(name)) as name, 'appetizers' as type FROM appetizers
    `);

    menuItemMap = result.rows.reduce((acc: Record<string, MenuItem>, row: any) => {
      acc[row.name] = { id: Number(row.id), type: row.type };
      return acc;
    }, {});

    // Add alternative names if necessary
    menuItemMap['honey sesame chicken breast'] = menuItemMap['honey sesame chicken'];
    menuItemMap['dasani'] = menuItemMap['dasani 16oz bottle'];
    // Add any other necessary alternative names

    console.log('Menu items loaded successfully.');
  } catch (error) {
    console.error('Failed to load menu items:', error);
  }
}

// Call loadMenuItems at startup
loadMenuItems();

// Function to normalize and map item name to ID and type
function normalizeAndMapItem(name: string): MenuItem | null {
  const lowercaseName = name.toLowerCase().trim();
  return menuItemMap[lowercaseName] || null;
}

// Function to check if item is a drink
function isDrinkItem(item: { menuItemId: string; name: string }): boolean {
  // First check menuItemMap
  const mapped = normalizeAndMapItem(item.name);
  if (mapped?.type === 'drink_table') return true;

  // Then check by keywords
  const lowercaseName = item.name.toLowerCase();
  const drinkKeywords = ['drink', 'tea', 'lemonade', 'water', 'coke', 'sprite', 'fanta', 'juice', 'pepsi', 'dr pepper', 'root beer', 'powerade'];
  return drinkKeywords.some(keyword => lowercaseName.includes(keyword));
}

// Function to parse combo items
function parseComboItems(comboName: string): { entrees: number[]; side: number } | null {
  const match = comboName.match(/^(Bowl|Plate|Bigger Plate)\s*\((.*)\)$/i);
  if (!match) return null;

  const items = match[2].split(',').map(item => item.trim());
  const side = items[items.length - 1];
  const entrees = items.slice(0, -1);

  // Map side to correct ID
  const mappedSide = normalizeAndMapItem(side);
  if (!mappedSide) {
    console.error(`Could not map side item: ${side}`);
    return null;
  }

  // Map entrees to their IDs
  const mappedEntrees = entrees.map(entree => {
    const mapped = normalizeAndMapItem(entree);
    if (!mapped) {
      console.error(`Could not map entree: ${entree}`);
      return null;
    }
    return mapped.id;
  }).filter(id => id !== null) as number[];

  if (mappedEntrees.length !== entrees.length) {
    console.error('Some entrees could not be mapped');
    return null;
  }

  return {
    entrees: mappedEntrees,
    side: mappedSide.id
  };
}

interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export const createOrder = async (req: Request, res: Response) => {
  const client = await db.connect(); // Acquire a client from the pool
  try {
    const { items, total } = req.body;
    console.log('Received order items:', items);

    await client.query('BEGIN'); // Start transaction on this client

    try {
      // Use client.query(...) for all queries within the transaction

      // Separate drinks, appetizers, and food items
      const drinkItems = items.filter(item => isDrinkItem(item));
      const appetizerItems = items.filter(item => {
        const mapped = normalizeAndMapItem(item.name);
        return mapped?.type === 'appetizers';
      });
      const foodItems = items.filter(item => !isDrinkItem(item) && !appetizerItems.includes(item));
      console.log('Identified drink items:', drinkItems);
      console.log('Identified appetizer items:', appetizerItems);

      // Process food items including combo contents
      const processedItems = foodItems.flatMap(item => {
        if (['41', '42', '43'].includes(item.menuItemId)) {
          const combo = parseComboItems(item.name);
          if (!combo) {
            console.error(`Failed to parse combo: ${item.name}`);
            return [];
          }
          return [
            ...combo.entrees.map(id => ({
              menuItemId: id,
              quantity: item.quantity,
              isCombo: true,
              type: 'entree_side'
            })),
            {
              menuItemId: combo.side,
              quantity: item.quantity,
              isCombo: true,
              type: 'entree_side'
            }
          ];
        }

        // For regular items
        const mapped = normalizeAndMapItem(item.name);
        if (!mapped) {
          console.error(`Could not map regular item: ${item.name}`);
          return [];
        }

        return [{
          menuItemId: mapped.id,
          quantity: item.quantity,
          isCombo: false,
          type: mapped.type
        }];
      });

      console.log('Processed food items:', processedItems);

      // Group processedItems by menuItemId and type
      const groupedProcessedItems = Object.values(
        processedItems.reduce((acc, item) => {
          const key = `${item.menuItemId}_${item.type}`;
          if (!acc[key]) {
            acc[key] = { ...item };
          } else {
            acc[key].quantity += item.quantity;
          }
          return acc;
        }, {} as Record<string, typeof processedItems[0]>)
      );

      // Group drinkItems by menuItemId and type
      const groupedDrinkItems = Object.values(
        drinkItems.reduce((acc, item) => {
          const key = `${item.menuItemId}_drink_table`;
          if (!acc[key]) {
            acc[key] = {
              menuItemId: Number(item.menuItemId),
              name: item.name,
              quantity: item.quantity,
              price: item.price
            };
          } else {
            acc[key].quantity += item.quantity;
          }
          return acc;
        }, {} as Record<string, any>)
      );

      // Group appetizerItems by menuItemId and type
      const groupedAppetizerItems = Object.values(
        appetizerItems.reduce((acc, item) => {
          const key = `${item.menuItemId}_appetizers`;
          if (!acc[key]) {
            acc[key] = {
              menuItemId: Number(item.menuItemId),
              name: item.name,
              quantity: item.quantity,
              price: item.price
            };
          } else {
            acc[key].quantity += item.quantity;
          }
          return acc;
        }, {} as Record<string, any>)
      );

      // Get item details for entree_side
      const itemDetails = await client.query(
        `SELECT es.id, es.name, es.type, 
                array_agg(DISTINCT jsonb_build_object('raw_id', ei.raw_item_id, 'quantity', ei.quantity)) as ingredients
         FROM entree_side es
         LEFT JOIN entree_ingredients ei ON es.id = ei.entree_id
         WHERE es.id = ANY($1::int[])
         GROUP BY es.id, es.name, es.type`,
        [groupedProcessedItems.map(item => item.menuItemId)]
      );

      // Get drink details
      let drinkDetails = [];
      if (groupedDrinkItems.length > 0) {
        const drinkResult = await client.query(
          'SELECT id, name FROM drink_table WHERE id = ANY($1::int[])',
          [groupedDrinkItems.map(item => item.menuItemId)]
        );
        drinkDetails = drinkResult.rows;
        console.log('Drink details:', drinkDetails);
      }

      // Get appetizer details
      let appetizerDetails = [];
      if (groupedAppetizerItems.length > 0) {
        const appetizerResult = await client.query(
          'SELECT id, name FROM appetizers WHERE id = ANY($1::int[])',
          [groupedAppetizerItems.map(item => item.menuItemId)]
        );
        appetizerDetails = appetizerResult.rows;
        console.log('Appetizer details:', appetizerDetails);
      }

      const itemDetailsMap = itemDetails.rows.reduce((acc, row) => {
        acc[row.id] = {
          name: row.name,
          type: row.type,
          ingredients: row.ingredients[0]?.raw_id ? row.ingredients : []
        };
        return acc;
      }, {} as Record<number, any>);

      // Format order details
      const orderDetails = {
        entree_side: groupedProcessedItems.map(item => ({
          id: item.menuItemId,
          name: itemDetailsMap[item.menuItemId]?.name,
          type: itemDetailsMap[item.menuItemId]?.type,
          quantity: item.quantity,
          from_combo: item.isCombo
        })),
        drink_table: groupedDrinkItems.map(item => ({
          id: item.menuItemId,
          name: item.name,
          quantity: item.quantity
        })),
        appetizers: groupedAppetizerItems.map(item => ({
          id: item.menuItemId,
          name: item.name,
          quantity: item.quantity
        })),
        free_items: [
          { id: 9, name: "Napkins", quantity: 2 },
          { id: 2, name: "Soy Sauce Packet", quantity: 1 },
          { id: 5, name: "Fortune Cookies", quantity: 1 },
          { id: 6, name: "Utensils (Forks)", quantity: 1 },
          { id: 7, name: "Utensils (Knives)", quantity: 1 },
          { id: 8, name: "Utensils (Spoons)", quantity: 1 },
          { id: 12, name: "Takeout Cartons", quantity: 1 }
        ]
      };

      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (datetime, sale, items) 
         VALUES ($1, $2, $3::jsonb) 
         RETURNING id`,
        [new Date(), total, orderDetails]
      );

      const orderId = orderResult.rows[0].id;

      // Insert all order items in batch
      const allOrderItems = [
        ...groupedProcessedItems.map(item => ({
          order_id: orderId,
          item_id: item.menuItemId,
          item_type: 'entree_side'
        })),
        ...groupedDrinkItems.map(item => ({
          order_id: orderId,
          item_id: item.menuItemId,
          item_type: 'drink_table'
        })),
        ...groupedAppetizerItems.map(item => ({
          order_id: orderId,
          item_id: item.menuItemId,
          item_type: 'appetizers'
        }))
      ];

      // Batch insert order items
      if (allOrderItems.length > 0) {
        const values = allOrderItems
          .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
          .join(', ');

        const params = [
          orderId,
          ...allOrderItems.flatMap(item => [item.item_id, item.item_type])
        ];

        await client.query(
          `INSERT INTO order_items (order_id, item_id, item_type) VALUES ${values}`,
          params
        );
      }

      // Update inventories
      const updatePromises = [];

      // Update entree_side inventory
      if (groupedProcessedItems.length > 0) {
        updatePromises.push(
          client.query(
            `UPDATE entree_side 
             SET inventory = inventory - v.quantity
             FROM (VALUES ${groupedProcessedItems.map((_, i) => `($${i * 2 + 1}::int, $${i * 2 + 2}::int)`).join(', ')}) 
             AS v(id, quantity)
             WHERE entree_side.id = v.id`,
            groupedProcessedItems.flatMap(item => [item.menuItemId, item.quantity])
          )
        );
      }

      // Update drink inventory
      if (groupedDrinkItems.length > 0) {
        updatePromises.push(
          client.query(
            `UPDATE drink_table 
             SET inventory = inventory - v.quantity
             FROM (VALUES ${groupedDrinkItems.map((_, i) => `($${i * 2 + 1}::int, $${i * 2 + 2}::int)`).join(', ')}) 
             AS v(id, quantity)
             WHERE drink_table.id = v.id`,
            groupedDrinkItems.flatMap(item => [item.menuItemId, item.quantity])
          )
        );
      }

      // Update appetizer inventory
      if (groupedAppetizerItems.length > 0) {
        updatePromises.push(
          client.query(
            `UPDATE appetizers 
             SET inventory = inventory - v.quantity
             FROM (VALUES ${groupedAppetizerItems.map((_, i) => `($${i * 2 + 1}::int, $${i * 2 + 2}::int)`).join(', ')}) 
             AS v(id, quantity)
             WHERE appetizers.id = v.id`,
            groupedAppetizerItems.flatMap(item => [item.menuItemId, item.quantity])
          )
        );
      }

      // Update raw ingredients
      const ingredientUpdates = groupedProcessedItems.flatMap(item => {
        const itemIngredients = itemDetailsMap[item.menuItemId]?.ingredients || [];
        return itemIngredients.map((ing: any) => ({
          raw_id: ing.raw_id,
          quantity: ing.quantity * item.quantity
        }));
      });

      if (ingredientUpdates.length > 0) {
        const rawIds = ingredientUpdates.map(i => i.raw_id);
        const quantities = ingredientUpdates.map(i => i.quantity);

        updatePromises.push(
          client.query(
            `UPDATE raw_items 
             SET inventory = raw_items.inventory - v.total_quantity
             FROM (
               SELECT raw_id, SUM(quantity) as total_quantity
               FROM unnest($1::int[], $2::decimal[])
               AS v(raw_id, quantity)
               GROUP BY raw_id
             ) v
             WHERE raw_items.id = v.raw_id`,
            [rawIds, quantities]
          )
        );
      }

      // Update free items
      updatePromises.push(
        client.query(
          `UPDATE free_items 
           SET inventory = CASE 
             WHEN id = 9 THEN inventory - 2
             WHEN id IN (2,5,6,7,8,12) THEN inventory - 1
             ELSE inventory 
           END
           WHERE id IN (2,5,6,7,8,9,12)`
        )
      );

      // Execute all updates in parallel
      await Promise.all(updatePromises);

      await client.query('COMMIT'); // Commit transaction

      res.json({
        success: true,
        orderId,
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('Transaction error:', error);
      await client.query('ROLLBACK'); // Rollback transaction
      throw error;
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  } finally {
    client.release(); // Release the client back to the pool
  }
};
