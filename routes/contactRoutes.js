import express from 'express';
import { submitContact, getAllContacts, updateContactStatus } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit', submitContact);
router.get('/', getAllContacts);
router.put('/:id/status', updateContactStatus);

export default router;