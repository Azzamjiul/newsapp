import { UserDeviceToken } from './userDeviceToken.model';
import { User } from './user.model';

export class UserDeviceTokenService {
  async addDeviceToken(userId: number, deviceToken: string) {
    // Prevent duplicate tokens for the same user
    const existing = await UserDeviceToken.findOne({ where: { userId, deviceToken } });
    if (existing) return existing;
    return UserDeviceToken.create({ userId, deviceToken });
  }

  async removeDeviceToken(userId: number, deviceToken: string) {
    return UserDeviceToken.destroy({ where: { userId, deviceToken } });
  }

  async listDeviceTokens(userId: number) {
    return UserDeviceToken.findAll({ where: { userId } });
  }
}

export class UserNotificationService {
  async setNotificationEnabled(userId: number, enabled: boolean) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    await user.update({ notificationsEnabled: enabled });
    return user;
  }

  async getNotificationEnabled(userId: number) {
    const user = await User.findByPk(userId);
    return user?.notificationsEnabled;
  }
}
