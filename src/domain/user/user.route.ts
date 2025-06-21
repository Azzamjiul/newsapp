import { Router } from 'express';
import { register, login, update, remove, getCurrentUser } from './user.controller';
import deviceTokenRouter from './userDeviceToken.route';
import { authenticateToken } from '../../middleware/auth.middleware';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.put('/:id', update);
userRouter.delete('/:id', remove);
userRouter.get('/me', authenticateToken, getCurrentUser);
userRouter.use('/device-tokens', deviceTokenRouter);

export default userRouter;