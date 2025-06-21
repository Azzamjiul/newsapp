import { Router } from 'express';
import {
  addDeviceToken,
  removeDeviceToken,
  listDeviceTokens,
  setNotificationEnabled,
  getNotificationEnabled,
  sendNotification,
} from './userDeviceToken.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const deviceTokenRouter = Router();

deviceTokenRouter.use(authenticateToken);
deviceTokenRouter.post('/', addDeviceToken);
deviceTokenRouter.delete('/', removeDeviceToken);
deviceTokenRouter.get('/', listDeviceTokens);
deviceTokenRouter.put('/notification', setNotificationEnabled);
deviceTokenRouter.get('/notification', getNotificationEnabled);
deviceTokenRouter.post('/notify', sendNotification);

export default deviceTokenRouter;
