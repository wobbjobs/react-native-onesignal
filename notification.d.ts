import { OSNotificationBase } from './notification_base';
import { OSNotificationDisplayType, OSNotificationActionType } from './defines';
export declare class OSNotificationAction {
    /**
     * Indicates if the notification was "opened", or if
     * a specific action button was pressed "actionTaken"
     */
    type: OSNotificationActionType;
    /** If a button was pressed, this will be the button/action ID */
    actionId: string;
    constructor(nativeJson: any);
}
export declare class OSNotificationPayload extends OSNotificationBase {
    /** The OneSignal Notification ID */
    notificationId?: string;
    /**
     * The name of the template used to create
     * this notification (if applicable)
     */
    templateName?: string;
    /**
     * The ID of the template used to create
     * this notification (if applicable)
     */
    templateId?: string;
    /** The badge count */
    badgeCount?: number;
    /**
     * The badge increment - if the existing badge count
     * is being incremented (ie. +1) this is used instead
     * of the 'badgeCount' parameter
     */
    iosBadgeIncrement?: number;
    /** The sound played for this notification */
    sound?: string;
    /** The raw notification payload */
    rawPayload?: any;
    constructor(nativeJson: any);
}
export declare class OSNotification {
    payload: OSNotificationPayload;
    displayType: OSNotificationDisplayType;
    shown: boolean;
    appInFocus: boolean;
    silent: boolean;
    constructor(nativeJson: any);
}
export declare class OSNotificationOpenedResult {
    notification: OSNotification;
    actionType?: OSNotificationActionType;
    constructor(nativeJson: any);
}
