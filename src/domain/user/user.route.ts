import { Router } from 'express';
import { register, login, update, remove } from './user.controller';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.put('/:id', update);
userRouter.delete('/:id', remove);

export default userRouter; 