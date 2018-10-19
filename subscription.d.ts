export declare class OSSubscriptionState {
    /**
     * Indicates if you have ever called setSubscription(false)
     * to disable notifications for this user.
     */
    userSubscriptionSetting: Boolean;
    /**
     * A boolean parameter that indicates if the user
     * is subscribed to your app with OneSignal. This
     * is only true if the `userId`, `pushToken`, and
     * `userSubscriptionSetting` parameters are defined
     * or true
     */
    subscribed: Boolean;
    /**
     * The current user's userId with OneSignal
     * Also known as 'playerId'
     */
    userId?: String;
    /** The APNS (iOS) or GCM/FCM (Android) push token */
    pushToken?: String;
    constructor(nativeJson: any);
}
/**
 * An instance of this class describes a change in the user's OneSignal
 * push notification subscription state, ie. the user subscribed to
 * push notifications with your app.
 */
export declare class OSSubscriptionStateChanges {
    /** The previous state of the subscription */
    from?: OSSubscriptionState;
    /** The current subscription state */
    to?: OSSubscriptionState;
    constructor(nativeJson: any);
}
export declare class OSEmailSubscriptionState {
    /**
     * Indicates if the user's email has been set with OneSignal
     * and the user has been assigned a OneSignal email userID
     */
    subscribed: Boolean;
    /** The user ID for this user's email record with OneSignal */
    emailUserId?: String;
    /** The user's email address */
    emailAddress?: String;
    constructor(nativeJson: any);
}
/**
 * An instance of this class describes a change in the user's OneSignal
 * email subscription state, ie. the user subscribed to email with your app.
 */
export declare class OSEmailSubscriptionStateChanges {
    /** The previous state of the subscription */
    from?: OSEmailSubscriptionState;
    /** The current subscription state */
    to?: OSEmailSubscriptionState;
    constructor(nativeJson: any);
}
