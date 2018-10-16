"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const defines_1 = require("./defines");
/** Publicly export enums defined in defines.ts */
var defines_2 = require("./defines");
exports.OSLogLevel = defines_2.OSLogLevel;
exports.OSNotificationActionType = defines_2.OSNotificationActionType;
exports.OSNotificationDisplayType = defines_2.OSNotificationDisplayType;
exports.OSCreateNotificationBadgeType = defines_2.OSCreateNotificationBadgeType;
var notification_1 = require("./notification");
exports.OSCreateNotification = notification_1.OSCreateNotification;
exports.OSActionButton = notification_1.OSActionButton;
/** Define the native module */
const RNOneSignal = react_native_1.NativeModules.OneSignal;
class OneSignal {
    constructor() {
        /**
         * Maps event names to event emitter subscriptions.
         */
        this.listeners = new Map();
        /**
         * Maps event names to the app's added event listeners
         * (eg. using OneSignal.addSubscriptionListener() etc.)
         */
        this.eventSubscribers = new Map();
        /**
         * Holds a cache of events that were received before the
         * app added a subscriber for the event
         */
        this.cachedEvents = new Map();
        this.eventEmitter = new react_native_1.NativeEventEmitter(RNOneSignal);
        defines_1.Events.forEach(event => {
            this.cachedEvents.set(event, []);
            this.listeners.set(event, this.eventEmitter.addListener(event, notification => {
                let handlers = this.eventSubscribers.get(event);
                if (handlers && handlers.length > 0) {
                    handlers.forEach(handler => {
                        handler(notification);
                    });
                }
                else {
                    var existing = this.cachedEvents.get(event);
                    if (existing) {
                        existing.push(notification);
                        this.cachedEvents.set(event, existing);
                    }
                    else {
                        this.cachedEvents.set(event, [notification]);
                    }
                }
            }));
        });
    }
    addListener(event, handler) {
        var existingListeners = this.eventSubscribers.get(event);
        if (existingListeners) {
            existingListeners.push(handler);
            this.eventSubscribers.set(event, existingListeners);
        }
        else {
            this.eventSubscribers.set(event, [handler]);
        }
        var cached = this.cachedEvents.get(event);
        if (cached && cached.length > 0) {
            cached.forEach(notification => {
                handler(notification);
            });
        }
        this.cachedEvents.delete(event);
    }
    onesignalLog(level, message) {
        RNOneSignal.log(level, message);
    }
    /**
     * Adds an observer that fires whenever a notification is received.
     * NOTE: This function may not fire reliably if your app is closed.
     *
     * @param handler The callback/function that fires when a notification
     * is received.
     */
    addNotificationReceivedObserver(handler) {
        this.addListener(defines_1.OSEvent.received, handler);
    }
    /**
     * Adds an observer that fires when a notification is opened.
     *
     * @param handler : The callback/function that fires when a
     * notification is opened
     */
    addNotificationOpenedObserver(handler) {
        this.addListener(defines_1.OSEvent.opened, handler);
    }
    /**
     * This observer fires whenever the user's push notification subscription
     * state changes with regards to OneSignal. For example, when the user
     * is registered with OneSignal and gets a userId, this observer fires.
     *
     * @param handler The callback/function that fires when the
     * user's push notification subscription state changes.
     */
    addSubscriptionObserver(handler) {
        this.addListener(defines_1.OSEvent.subscription, handler);
    }
    /**
     * This observer fires when the user's push permission changes. For example,
     * if the user in iOS accepts push notification permission, this observer fires.
     *
     * @param handler The callback/function that fires when permission changes.
     */
    addPermissionObserver(handler) {
        this.addListener(defines_1.OSEvent.permission, handler);
    }
    /**
     * This observer fires when the user's email subscription state changes. For
     * example, when the user uses setEmail() and is assigned an email userId,
     * this observer will fire.
     *
     * @param handler The callback/function that fires when the email subscription
     * state changes.
     */
    addEmailSubscriptionObserver(handler) {
        this.addListener(defines_1.OSEvent.emailSubscription, handler);
    }
    /**
     * Clears all event observers/listeners
     */
    clearObservers() {
        this.eventSubscribers.clear();
    }
    /**
     * iOS-only.
     * Prompts for push notification permission. Replaces registerForPushNotifications()
     */
    promptForPushNotificationPermission(callback) {
        if (react_native_1.Platform.OS == 'ios') {
            RNOneSignal.promptForPushNotificationPermission(callback || function () { });
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, "promptForPushNotificationPermission() is only applicable in iOS.");
        }
    }
    /**
     * Initializes the OneSignal SDK.
     *
     * @param appId The OneSignal App ID for your application.
     * @param iOSSettings iOS-specific to control various settings, such as whether
     *    or not to prompt users before opening a push notification URL webview
     */
    init(appId, iOSSettings) {
        if (react_native_1.Platform.OS == 'ios') {
            RNOneSignal.initWithAppId(appId, iOSSettings);
        }
        else {
            RNOneSignal.init(appId);
        }
    }
    getPermissionSubscriptionState(callback) {
        console.log("Getting permission subscription state");
        RNOneSignal.getPermissionSubscriptionState(callback || function () { });
    }
    sendTag(key, value, callback) {
        this.sendTags({ key: value }, callback || function () { });
    }
    sendTags(tags, callback) {
        RNOneSignal.sendTags(tags, callback || function () { });
    }
    deleteTags(keys, callback) {
        RNOneSignal.deleteTags(keys, callback || function () { });
    }
    deleteTag(key, callback) {
        this.deleteTags([key], callback || function () { });
    }
    enableAndroidVibrate(enable) {
        if (react_native_1.Platform.OS == 'android') {
            RNOneSignal.enableVibrate(enable);
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, "enableAndroidVibrate() is not available in iOS.");
        }
    }
    enableAndroidSound(enable) {
        if (react_native_1.Platform.OS == 'android') {
            RNOneSignal.enableSound(enable);
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, "enableAndroidSound() is not available in iOS.");
        }
    }
    setEmail(email, emailAuthCode, callback) {
        RNOneSignal.setEmail(email, emailAuthCode, callback || function () { });
    }
    logoutEmail(callback) {
        RNOneSignal.logoutEmail(callback || function () { });
    }
    setLocationShared(shared) {
        RNOneSignal.setLocationShared(shared);
    }
    setSubscription(enabled) {
        RNOneSignal.setSubscription(enabled);
    }
    promptLocation() {
        RNOneSignal.promptLocation();
    }
    setInFocusDisplayType(type) {
        RNOneSignal.setInFocusDisplayType(type);
    }
    postNotification(notification, callback) {
        console.log("notification:");
        console.log(notification);
        RNOneSignal.postNotification(notification.build(), callback || function () { });
    }
    clearOneSignalAndroidNotifications() {
        if (react_native_1.Platform.OS == 'android') {
            RNOneSignal.clearOneSignalNotifications();
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, 'clearOneSignalAndroidNotifications() is not available in iOS');
        }
    }
    cancelAndroidNotification(notificationId) {
        if (react_native_1.Platform.OS == 'android') {
            RNOneSignal.cancelNotification(notificationId);
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, 'cancelAndroidNotification() is not available in iOS.');
        }
    }
    setLogLevel(consoleLevel, visualLogLevel) {
        RNOneSignal.setLogLevel(consoleLevel, visualLogLevel);
    }
    setRequiresUserPrivacyConsent(required) {
        RNOneSignal.setRequiresUserPrivacyConsent(required);
    }
    provideUserPrivacyConsent(granted = true) {
        RNOneSignal.provideUserConsent(granted);
    }
    userProvidedPrivacyConsent() {
        return RNOneSignal.userProvidedPrivacyConsent();
    }
    presentAppNotificationSettings() {
        if (react_native_1.Platform.OS == 'ios') {
            RNOneSignal.presentAppSettings();
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, 'presentAppNotificationSettings() is only available in iOS.');
        }
    }
}
/**
 * Declares a singleton instance that represents OneSignal's React-Native SDK
 */
OneSignal.shared = new OneSignal();
exports.OneSignal = OneSignal;
