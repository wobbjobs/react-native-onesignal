import { OSCreateNotificationDelayOption } from 'react-native-onesignal/src/defines';
export declare class OSActionButton {
    /** The custom identifier for this button/action */
    id: string;
    /** The title for the button */
    title: string;
    /** Android only - the URL/filename for the icon */
    icon?: string;
    /** constructor function */
    constructor(id: string, title: string, icon?: string);
    jsonRepresentation(): any;
}
export declare class OSNotificationBase {
    /** The notification's content (body) */
    content?: string;
    /** The title/heading for the notification */
    heading?: string;
    /** The subtitle for the notification (iOS 10+ only) */
    subtitle?: string;
    /** Tells the app to launch in the background (iOS only) */
    contentAvailable?: boolean;
    /**
     * Tells the app to launch the Notification Service extension,
     * which can mutate your notification (ie. download attachments)
     */
    mutableContent?: boolean;
    /** Additional data you wish to send with the notification */
    additionalData?: Object;
    /** The URL to open when the user taps the notification */
    url?: string;
    /**
     * Media (images, videos, etc.) for iOS. Maps a custom
     * ID to a resource URL in the format {'id' : 'https://.....'}
     */
    iosAttachments?: Map<string, string>;
    /** An image to use as the big picture (android only) */
    bigPicture?: string;
    /** A list of buttons to attach to the notification */
    buttons?: Array<OSActionButton>;
    /**
     * The category identifier for iOS (controls various aspects
     * of the notification, for example, whether to launch a
     * Notification Content Extension) (iOS only)
     */
    iosCategory?: string;
    /**
     * A small icon (Android only)
     * Can be a drawable resource name or a URL
    */
    androidSmallIcon?: string;
    /**
     * A large icon (Android only)
     * Can be a drawable resource name or a URL
    */
    androidLargeIcon?: string;
    /** The Android Oreo Notification Category to send the notification under */
    androidChannelId?: string;
    /**
     * If multiple notifications have the same collapse ID, only the most
     * recent notification will be shown. (For iOS 12+ thread ID is preferred)
     */
    collapseId?: string;
    /** Allows you to send a notification at a specific date */
    sendAfter?: Date;
    /** Allows you to control how the notification is delayed */
    delayOption?: OSCreateNotificationDelayOption;
    /**
     * Used in conjunction with delayedOption == timezone, lets you specify what
     * time of day each user should receive the notification, ie. "9:00 AM"
     */
    deliveryTimeOfDay?: string;
    /** The Thread-ID for this notification (iOS 12+) */
    iosThreadId?: string;
    constructor(nativeJson: any);
}
