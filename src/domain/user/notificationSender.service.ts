import { UserDeviceToken } from './userDeviceToken.model';
import { User } from './user.model';
import { FcmService } from '../../infrastructure/fcm.service';

export class NotificationSenderService {
  private fcmService = new FcmService();

  async sendPushToUser(userId: number, payload: any) {
    const user = await User.findByPk(userId);
    if (!user || !user.notificationsEnabled) return { successCount: 0, failureCount: 0 };
    const tokens = await UserDeviceToken.findAll({ where: { userId } });
    const deviceTokens = tokens.map((t: UserDeviceToken) => t.deviceToken);
    if (!deviceTokens.length) return { successCount: 0, failureCount: 0 };
    return this.fcmService.sendToDevice(deviceTokens, payload);
  }
}
