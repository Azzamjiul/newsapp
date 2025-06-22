import { UserDeviceToken } from './userDeviceToken.model';
import { User } from './user.model';
import { FcmService } from '../../infrastructure/fcm.service';

// Simple logger for investigation
const log = (...args: any[]) => console.log('[NotificationSenderService]', ...args);

export class NotificationSenderService {
  private fcmService = new FcmService();

  async sendPushToUser(userId: number, payload: any) {
    log('sendPushToUser called', { userId, payload });
    const user = await User.findByPk(userId);
    if (!user) {
      log('User not found', { userId });
      return { successCount: 0, failureCount: 0 };
    }
    if (!user.notificationsEnabled) {
      log('Notifications disabled for user', { userId });
      return { successCount: 0, failureCount: 0 };
    }
    const tokens = await UserDeviceToken.findAll({ where: { userId } });
    const deviceTokens = tokens.map((t: UserDeviceToken) => t.deviceToken);
    log('Device tokens found', { userId, deviceTokens });
    if (!deviceTokens.length) {
      log('No device tokens for user', { userId });
      return { successCount: 0, failureCount: 0 };
    }
    const result = await this.fcmService.sendToDevice(deviceTokens, payload);
    log('FCM sendToDevice result', { userId, result });
    return result;
  }
}
