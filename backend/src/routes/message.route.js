import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUserForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/user', protectRoute, getUserForSidebar);
router.get('/:id', protectRoute, getMessages); // Updated endpoint

router.post('/send/:id', protectRoute, sendMessage); // Updated endpoint

export default router;
