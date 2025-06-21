import admin from 'firebase-admin';

export class FcmService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }

  async sendToDevice(
    deviceTokens: string[],
    payload: { notification: { title: string; body: string }; data?: { [key: string]: string } }
  ) {
    if (!deviceTokens.length) return { successCount: 0, failureCount: 0 };
    // Fallback for older firebase-admin: send each token individually
    let successCount = 0;
    let failureCount = 0;
    for (const token of deviceTokens) {
      try {
        await admin.messaging().send({
          token,
          notification: payload.notification,
          data: payload.data || {},
        });
        successCount++;
      } catch (e) {
        failureCount++;
      }
    }
    return { successCount, failureCount };
  }
}
