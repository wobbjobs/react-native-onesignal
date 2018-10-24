"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const defines_1 = require("./defines");
const notification_1 = require("./notification");
const subscription_1 = require("./subscription");
const permission_1 = require("react-native-onesignal/src/permission");
/** Define the native module */
const OSNativeModule = react_native_1.NativeModules.OneSignal;
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
        this.eventEmitter = new react_native_1.NativeEventEmitter(OSNativeModule);
        this.setupObservers();
    }
    addPrivateObserver(event, handler) {
        this.listeners.set(event, this.eventEmitter.addListener(event, object => {
            handler(object);
        }));
    }
    addObserver(event, handler) {
        let eventObservers = this.eventSubscribers.get(event);
        if (eventObservers && eventObservers.length > 0) {
            eventObservers.push(handler);
            this.eventSubscribers.set(event, eventObservers);
        }
        else {
            this.eventSubscribers.set(event, [handler]);
        }
    }
    fireObservers(event, object) {
        let handlers = this.eventSubscribers.get(event);
        if (handlers && handlers.length > 0) {
            handlers.forEach(handler => {
                handler(object);
            });
        }
        else {
            var existing = this.cachedEvents.get(event);
            if (existing) {
                existing.push(object);
                this.cachedEvents.set(event, existing);
            }
            else {
                this.cachedEvents.set(event, [object]);
            }
        }
    }
    setupObservers() {
        this.addPrivateObserver(defines_1.OSEvent.received, object => {
            let notification = new notification_1.OSNotification(object);
            this.fireObservers(defines_1.OSEvent.received, notification);
        });
        this.addPrivateObserver(defines_1.OSEvent.opened, object => {
            let result = new notification_1.OSNotificationOpenedResult(object);
            this.fireObservers(defines_1.OSEvent.opened, result);
        });
        this.addPrivateObserver(defines_1.OSEvent.subscription, object => {
            let changes = new subscription_1.OSSubscriptionStateChanges(object);
            this.fireObservers(defines_1.OSEvent.subscription, changes);
        });
        this.addPrivateObserver(defines_1.OSEvent.permission, object => {
            let changes = new permission_1.OSPermissionStateChanges(object);
            this.fireObservers(defines_1.OSEvent.permission, changes);
        });
        this.addPrivateObserver(defines_1.OSEvent.emailSubscription, object => {
            let changes = new subscription_1.OSEmailSubscriptionStateChanges(object);
            this.fireObservers(defines_1.OSEvent.emailSubscription, changes);
        });
    }
    onesignalLog(level, message) {
        OSNativeModule.log(level, message);
    }
    /**
     * Adds an observer that fires whenever a notification is received.
     * NOTE: This function may not fire reliably if your app is closed.
     *
     * @param handler The callback/function that fires when a notification
     * is received.
     */
    addNotificationReceivedObserver(handler) {
        this.addObserver(defines_1.OSEvent.received, handler);
    }
    /**
     * Adds an observer that fires when a notification is opened.
     *
     * @param handler : The callback/function that fires when a
     * notification is opened
     */
    addNotificationOpenedObserver(handler) {
        this.addObserver(defines_1.OSEvent.opened, handler);
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
        this.addObserver(defines_1.OSEvent.subscription, handler);
    }
    /**
     * This observer fires when the user's push permission changes. For example,
     * if the user in iOS accepts push notification permission, this observer fires.
     *
     * @param handler The callback/function that fires when permission changes.
     */
    addPermissionObserver(handler) {
        this.addObserver(defines_1.OSEvent.permission, handler);
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
        this.addObserver(defines_1.OSEvent.emailSubscription, handler);
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
            OSNativeModule.promptForPushNotificationPermission(callback || function () { });
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
            OSNativeModule.initWithAppId(appId, iOSSettings);
        }
        else {
            OSNativeModule.init(appId);
        }
    }
    /**
     * Returns an instance of OSPermissionSubscriptionState
     */
    getPermissionSubscriptionState() {
        return __awaiter(this, void 0, void 0, function* () {
            return new permission_1.OSPermissionSubscriptionState(yield OSNativeModule.getPermissionSubscriptionState());
        });
    }
    getTags(callback) {
        OSNativeModule.getTags(callback || function () { });
    }
    sendTag(key, value, callback) {
        this.sendTags({ key: value }, callback || function () { });
    }
    sendTags(tags, callback) {
        OSNativeModule.sendTags(tags, callback || function () { });
    }
    deleteTags(keys, callback) {
        OSNativeModule.deleteTags(keys, callback || function () { });
    }
    deleteTag(key, callback) {
        this.deleteTags([key], callback || function () { });
    }
    enableAndroidVibrate(enable) {
        if (react_native_1.Platform.OS == 'android') {
            OSNativeModule.enableVibrate(enable);
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, "enableAndroidVibrate() is not available in iOS.");
        }
    }
    enableAndroidSound(enable) {
        if (react_native_1.Platform.OS == 'android') {
            OSNativeModule.enableSound(enable);
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, "enableAndroidSound() is not available in iOS.");
        }
    }
    setEmail(email, emailAuthCode, callback) {
        OSNativeModule.setEmail(email, emailAuthCode, callback || function () { });
    }
    logoutEmail(callback) {
        OSNativeModule.logoutEmail(callback || function () { });
    }
    setLocationShared(shared) {
        OSNativeModule.setLocationShared(shared);
    }
    setSubscription(enabled) {
        OSNativeModule.setSubscription(enabled);
    }
    promptLocation() {
        OSNativeModule.promptLocation();
    }
    setInFocusDisplayType(type) {
        OSNativeModule.setInFocusDisplayType(type);
    }
    postNotification(notification, callback) {
        console.log("Posting notification");
        console.log(notification);
        OSNativeModule.postNotification(notification.build(), callback || function () { });
    }
    clearOneSignalAndroidNotifications() {
        if (react_native_1.Platform.OS == 'android') {
            OSNativeModule.clearOneSignalNotifications();
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, 'clearOneSignalAndroidNotifications() is not available in iOS');
        }
    }
    cancelAndroidNotification(notificationId) {
        if (react_native_1.Platform.OS == 'android') {
            OSNativeModule.cancelNotification(notificationId);
        }
        else {
            this.onesignalLog(defines_1.OSLogLevel.warn, 'cancelAndroidNotification() is not available in iOS.');
        }
    }
    setLogLevel(consoleLevel, visualLogLevel) {
        OSNativeModule.setLogLevel(consoleLevel, visualLogLevel);
    }
    setRequiresUserPrivacyConsent(required) {
        OSNativeModule.setRequiresUserPrivacyConsent(required);
    }
    provideUserPrivacyConsent(granted = true) {
        OSNativeModule.provideUserConsent(granted);
    }
    userProvidedPrivacyConsent() {
        return OSNativeModule.userProvidedPrivacyConsent();
    }
    presentAppNotificationSettings() {
        if (react_native_1.Platform.OS == 'ios') {
            OSNativeModule.presentAppSettings();
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
