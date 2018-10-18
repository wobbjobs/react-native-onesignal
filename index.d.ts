import { OSLogLevel, OSNotificationDisplayType } from './defines';
import { OSCreateNotification } from './create_notification';
/** Publicly export enums defined in defines.ts */
export { OSLogLevel, OSNotificationActionType, OSNotificationDisplayType, OSCreateNotificationBadgeType } from './defines';
export { OSCreateNotification } from './create_notification';
export { OSActionButton } from './notification_base';
export { OSNotificationPayload, OSNotification } from './notification';
export declare class OneSignal {
    /**
     * Declares a singleton instance that represents OneSignal's React-Native SDK
     */
    static shared: OneSignal;
    /**
     * Holds a reference to the native event emitter, which
     * lets the SDK get events from the native SDK's (iOS and Android)
     */
    private eventEmitter;
    /**
     * Maps event names to event emitter subscriptions.
     */
    private listeners;
    /**
     * Maps event names to the app's added event listeners
     * (eg. using OneSignal.addSubscriptionListener() etc.)
     */
    private eventSubscribers;
    /**
     * Holds a cache of events that were received before the
     * app added a subscriber for the event
     */
    private cachedEvents;
    constructor();
    private addPrivateObserver(event, handler);
    private addObserver(event, handler);
    private fireObservers<T>(event, object);
    private setupObservers();
    private onesignalLog(level, message);
    /**
     * Adds an observer that fires whenever a notification is received.
     * NOTE: This function may not fire reliably if your app is closed.
     *
     * @param handler The callback/function that fires when a notification
     * is received.
     */
    addNotificationReceivedObserver(handler: Function): void;
    /**
     * Adds an observer that fires when a notification is opened.
     *
     * @param handler : The callback/function that fires when a
     * notification is opened
     */
    addNotificationOpenedObserver(handler: Function): void;
    /**
     * This observer fires whenever the user's push notification subscription
     * state changes with regards to OneSignal. For example, when the user
     * is registered with OneSignal and gets a userId, this observer fires.
     *
     * @param handler The callback/function that fires when the
     * user's push notification subscription state changes.
     */
    addSubscriptionObserver(handler: Function): void;
    /**
     * This observer fires when the user's push permission changes. For example,
     * if the user in iOS accepts push notification permission, this observer fires.
     *
     * @param handler The callback/function that fires when permission changes.
     */
    addPermissionObserver(handler: Function): void;
    /**
     * This observer fires when the user's email subscription state changes. For
     * example, when the user uses setEmail() and is assigned an email userId,
     * this observer will fire.
     *
     * @param handler The callback/function that fires when the email subscription
     * state changes.
     */
    addEmailSubscriptionObserver(handler: Function): void;
    /**
     * Clears all event observers/listeners
     */
    clearObservers(): void;
    /**
     * iOS-only.
     * Prompts for push notification permission. Replaces registerForPushNotifications()
     */
    promptForPushNotificationPermission(callback?: Function): void;
    /**
     * Initializes the OneSignal SDK.
     *
     * @param appId The OneSignal App ID for your application.
     * @param iOSSettings iOS-specific to control various settings, such as whether
     *    or not to prompt users before opening a push notification URL webview
     */
    init(appId: String, iOSSettings: Object): void;
    getPermissionSubscriptionState(callback?: Function): void;
    sendTag(key: String, value: any, callback?: Function): void;
    sendTags(tags: Object, callback?: Function): void;
    deleteTags(keys: Array<String>, callback?: Function): void;
    deleteTag(key: String, callback?: Function): void;
    enableAndroidVibrate(enable: Boolean): void;
    enableAndroidSound(enable: Boolean): void;
    setEmail(email: String, emailAuthCode?: String, callback?: Function): void;
    logoutEmail(callback?: Function): void;
    setLocationShared(shared: Boolean): void;
    setSubscription(enabled: Boolean): void;
    promptLocation(): void;
    setInFocusDisplayType(type: OSNotificationDisplayType): void;
    postNotification(notification: OSCreateNotification, callback?: Function): void;
    clearOneSignalAndroidNotifications(): void;
    cancelAndroidNotification(notificationId: Number): void;
    setLogLevel(consoleLevel: OSLogLevel, visualLogLevel: OSLogLevel): void;
    setRequiresUserPrivacyConsent(required: Boolean): void;
    provideUserPrivacyConsent(granted?: boolean): void;
    userProvidedPrivacyConsent(): Boolean;
    presentAppNotificationSettings(): void;
}
