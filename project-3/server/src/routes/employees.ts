//TODO
// server/src/routes/menu.ts
import { Router } from 'express';
import { getAllEmployees, updateEmployee, addEmployee, deleteEmployee } from '../controllers/employeeController';

const router = Router();
console.log('Employee loaded');
// Route to get all menu items
router.get('/', getAllEmployees);
router.post('/', updateEmployee);        // New route to add an item
router.put('/', addEmployee);
router.delete('/', deleteEmployee);


export default router;