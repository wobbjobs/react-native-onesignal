import { OSCreateNotificationBadgeType } from './defines';
import { OSNotificationBase } from './notification_base';
export declare class OSCreateNotification extends OSNotificationBase {
    /**
     * The App ID that the recipient playerIds are registered with
     * (usually - your app's appId)
     */
    appId: String;
    /** The two-character language code (ie. "en" by default) */
    language: string;
    /** the language for the notification ("en" by default) */
    /** An array of user ID's that should receive this notification */
    playerIds: String[];
    /**
     * Controls if the badge count number overrides the existing badge
     * count (set), or if it is added to the existing count (increase).
     * To decrease, use "increase" with a negative badgeCount
     */
    iosBadgeType?: OSCreateNotificationBadgeType;
    /**
     * The actual badge count to either set to directly, or increment by
     * To decrement the user's badge count, send a negative value
     */
    iosBadgeCount?: Number;
    /** The sound to play (iOS only) */
    iosSound?: String;
    /** The sound to play (Android only) */
    androidSound?: String;
    constructor(notificationAppId: String);
    build(): any;
}
