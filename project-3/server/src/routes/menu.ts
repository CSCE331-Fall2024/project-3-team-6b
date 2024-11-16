// server/src/routes/menu.ts
import { Router } from 'express';
import { addMenuItem, updateMenuItem, removeMenuItem, getMenuItems, getItemPrice } from '../controllers/menuController';

const router = Router();
console.log('Menu route loaded');
// Route to get all menu items
router.get('/', getMenuItems);
router.post('/', addMenuItem);        // New route to add an item
router.put('/', updateMenuItem);
router.delete('/', removeMenuItem);

// New route to fetch price of a specific menu item
router.get('/price', getItemPrice);

export default router;

