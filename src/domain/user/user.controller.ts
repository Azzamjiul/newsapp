import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const userService = new UserService();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Email already in use
 */
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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const user = await userService.getById(authReq.user!.id);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
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