import { OneSignal } from './onesignal';
/** Publicly export enums/consts defined in defines.ts */
export { OSLogLevel, OSNotificationPermission, OSNotificationActionType, OSNotificationDisplayType, OSCreateNotificationBadgeType, OSCreateNotificationDelayOption } from './defines';
export { OSNotificationAction, OSNotificationPayload, OSNotification, OSNotificationOpenedResult } from './notification';
export { OSPermissionState, OSPermissionStateChanges, OSPermissionSubscriptionState } from './permission';
export { OSSubscriptionState, OSSubscriptionStateChanges, OSEmailSubscriptionState, OSEmailSubscriptionStateChanges } from './subscription';
export { OSCreateNotification } from './create_notification';
export { OSActionButton } from './notification_base';
/** Export OneSignal.shared singleton */
export declare let RNOneSignal: OneSignal;
