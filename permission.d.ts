import { OSNotificationPermission } from './defines';
import { OSSubscriptionState, OSEmailSubscriptionState } from 'react-native-onesignal/src/subscription';
export declare class OSPermissionState {
    /**
     * iOS only. Indicates if the user has been prompted to
     * allow push notifications.
     */
    hasPrompted: boolean;
    /**
     * iOS only. Indicates if the app is currently using
     * 'provisional' authorization, meaning the app can
     * send notifications without asking for permission
     * but notifications go directly to notification center.
     */
    provisional: boolean;
    /** The user's current notification permission status */
    status: OSNotificationPermission;
    constructor(nativeJson: any);
}
export declare class OSPermissionSubscriptionState {
    /**
     * The current permission/authorization state (ie. did the user
     * tap 'Allow' on the Allow Notifications prompt in iOS)
     */
    permissionStatus?: OSPermissionState;
    /** The state of the user's push subscription with OneSignal */
    subscriptionStatus?: OSSubscriptionState;
    /** The state of the user's email subscription with OneSignal */
    emailSubscriptionStatus?: OSEmailSubscriptionState;
    constructor(nativeJson: any);
}
export declare class OSPermissionStateChanges {
    /** The permission state before the change */
    from?: OSPermissionState;
    /** The new/updated permission state */
    to?: OSPermissionState;
    constructor(nativeJson: any);
}
