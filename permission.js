"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defines_1 = require("./defines");
const subscription_1 = require("react-native-onesignal/src/subscription");
class OSPermissionState {
    constructor(nativeJson) {
        /**
         * iOS only. Indicates if the user has been prompted to
         * allow push notifications.
         */
        this.hasPrompted = false;
        /**
         * iOS only. Indicates if the app is currently using
         * 'provisional' authorization, meaning the app can
         * send notifications without asking for permission
         * but notifications go directly to notification center.
         */
        this.provisional = false;
        /** The user's current notification permission status */
        this.status = defines_1.OSNotificationPermission.notDetermined;
        if (nativeJson.status) {
            //ios
            this.status = nativeJson.status;
        }
        else if (nativeJson.enabled) {
            //android
            let enabled = nativeJson.enabled;
            this.status = enabled ? defines_1.OSNotificationPermission.authorized : defines_1.OSNotificationPermission.denied;
        }
        if (nativeJson.provisional)
            this.provisional = nativeJson.provisional;
        if (nativeJson.hasPrompted)
            this.hasPrompted = nativeJson.hasPrompted;
    }
}
exports.OSPermissionState = OSPermissionState;
class OSPermissionSubscriptionState {
    constructor(nativeJson) {
        console.log("permission subscription state");
        console.log(nativeJson);
        this.permissionStatus = new OSPermissionState(nativeJson.permissionStatus);
        this.subscriptionStatus = new subscription_1.OSSubscriptionState(nativeJson.subscriptionStatus);
        this.emailSubscriptionStatus = new subscription_1.OSEmailSubscriptionState(nativeJson.emailSubscriptionStatus);
    }
}
exports.OSPermissionSubscriptionState = OSPermissionSubscriptionState;
class OSPermissionStateChanges {
    constructor(nativeJson) {
        if (nativeJson.from)
            this.from = new OSPermissionState(nativeJson.from);
        if (nativeJson.to)
            this.to = new OSPermissionState(nativeJson.to);
    }
}
exports.OSPermissionStateChanges = OSPermissionStateChanges;
