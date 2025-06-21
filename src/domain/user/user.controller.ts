import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const userService = new UserService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const user = await userService.register(name, email, password);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(409).json({ message: err.message });
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const result = await userService.login(email, password);
    return res.json(result);
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const user = await userService.getById(authReq.user!.id);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { id } = req.params;
  const { name, email, password } = req.body;
  
  // Users can only update their own profile
  if (authReq.user?.id !== Number(id)) {
    res.status(403).json({ message: 'You can only update your own profile' });
    return;
  }
  
  try {
    const user = await userService.update(Number(id), { name, email, password });
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { id } = req.params;
  
  // Users can only delete their own profile
  if (authReq.user?.id !== Number(id)) {
    res.status(403).json({ message: 'You can only delete your own profile' });
    return;
  }
  
  try {
    const result = await userService.remove(Number(id));
    res.json(result);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});