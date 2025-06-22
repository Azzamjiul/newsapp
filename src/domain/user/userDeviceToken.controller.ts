import { Request, Response } from 'express';
import { UserDeviceTokenService, UserNotificationService } from './userDeviceToken.service';
import { addDeviceTokenSchema, updateNotificationSchema } from './userDeviceToken.dto';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';
import { NotificationSenderService } from './notificationSender.service';
import { z } from 'zod';

const deviceTokenService = new UserDeviceTokenService();
const notificationService = new UserNotificationService();
const notificationSender = new NotificationSenderService();

const sendNotificationSchema = z.object({
  userId: z.number(),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string()).optional(),
});

/**
 * @swagger
 * /api/users/notify:
 *   post:
 *     summary: Send push notification to a user
 *     tags:
 *       - User Device Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               data:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Notification sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successCount:
 *                   type: integer
 *                 failureCount:
 *                   type: integer
 */
export const sendNotification = asyncHandler(async (req: Request, res: Response) => {
  const { userId, title, body, data } = sendNotificationSchema.parse(req.body);
  const payload = {
    notification: { title, body },
    data: data || {},
  };
  const result = await notificationSender.sendPushToUser(userId, payload);
  res.json(result);
});

/**
 * @swagger
 * /api/users/device-tokens:
 *   post:
 *     summary: Add a device token for the current user
 *     tags:
 *       - User Device Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: Device token added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDeviceToken'
 */
export const addDeviceToken = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { deviceToken } = addDeviceTokenSchema.parse(req.body);
  const token = await deviceTokenService.addDeviceToken(authReq.user!.id, deviceToken);
  res.status(201).json(token);
});

/**
 * @swagger
 * /api/users/device-tokens:
 *   delete:
 *     summary: Remove a device token for the current user
 *     tags:
 *       - User Device Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceToken:
 *                 type: string
 *     responses:
 *       204:
 *         description: Device token removed
 */
export const removeDeviceToken = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { deviceToken } = req.body;
  await deviceTokenService.removeDeviceToken(authReq.user!.id, deviceToken);
  res.status(204).send();
});

/**
 * @swagger
 * /api/users/device-tokens:
 *   get:
 *     summary: List all device tokens for the current user
 *     tags:
 *       - User Device Token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of device tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDeviceToken'
 */
export const listDeviceTokens = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const tokens = await deviceTokenService.listDeviceTokens(authReq.user!.id);
  res.json(tokens);
});

/**
 * @swagger
 * /api/users/device-tokens/notification:
 *   put:
 *     summary: Set notification enabled/disabled for the current user
 *     tags:
 *       - User Device Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationsEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification preference updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificationsEnabled:
 *                   type: boolean
 */
export const setNotificationEnabled = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { notificationsEnabled } = updateNotificationSchema.parse(req.body);
  await notificationService.setNotificationEnabled(authReq.user!.id, notificationsEnabled);
  res.status(200).json({ notificationsEnabled });
});

/**
 * @swagger
 * /api/users/device-tokens/notification:
 *   get:
 *     summary: Get notification enabled/disabled status for the current user
 *     tags:
 *       - User Device Token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preference
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificationsEnabled:
 *                   type: boolean
 */
export const getNotificationEnabled = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const enabled = await notificationService.getNotificationEnabled(authReq.user!.id);
  res.json({ notificationsEnabled: enabled });
});
