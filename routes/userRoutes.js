import express from 'express';
import { getAllUsers, toggleUserStatus, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.put('/:id/toggle-status', toggleUserStatus);
router.put('/:id', updateUser);

export default router;