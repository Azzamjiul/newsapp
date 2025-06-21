import { z } from 'zod';

export const addDeviceTokenSchema = z.object({
  deviceToken: z.string().min(10),
});

export const updateNotificationSchema = z.object({
  notificationsEnabled: z.boolean(),
});
