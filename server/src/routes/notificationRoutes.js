import express from 'express';
const router = express.Router();
import { addNotification, getNotifications, cleanUpNotification , getFilteredNotifications} from '../controllers/notificationController.js';

router.get('/:roomId',getNotifications);
router.post('/:roomId',addNotification );
router.delete('/:roomId/cleanup',cleanUpNotification);
router.get('/:roomId/filter',getFilteredNotifications);

export default router;