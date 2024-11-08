// server/src/routes/menu.ts
import { Router } from 'express';
import { addMenuItem, updateMenuItem, getMenuItems } from '../controllers/menuController';

const router = Router();
console.log('Menu route loaded');
// Route to get all menu items
router.get('/', getMenuItems);
router.post('/', addMenuItem);        // New route to add an item
router.put('/', updateMenuItem);

export default router;

