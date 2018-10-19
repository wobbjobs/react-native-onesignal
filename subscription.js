"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OSSubscriptionState {
    constructor(nativeJson) {
        this.userSubscriptionSetting = nativeJson.userSubscriptionSetting;
        this.subscribed = nativeJson.subscribed;
        this.userId = nativeJson.userId;
        this.pushToken = nativeJson.pushToken;
    }
}
exports.OSSubscriptionState = OSSubscriptionState;
/**
 * An instance of this class describes a change in the user's OneSignal
 * push notification subscription state, ie. the user subscribed to
 * push notifications with your app.
 */
class OSSubscriptionStateChanges {
    constructor(nativeJson) {
        if (nativeJson.from)
            this.from = new OSSubscriptionState(nativeJson.from);
        if (nativeJson.to)
            this.to = new OSSubscriptionState(nativeJson.to);
    }
}
exports.OSSubscriptionStateChanges = OSSubscriptionStateChanges;
class OSEmailSubscriptionState {
    constructor(nativeJson) {
        this.subscribed = nativeJson.subscribed;
        this.emailUserId = nativeJson.emailUserId;
        this.emailAddress = nativeJson.emailAddress;
    }
}
exports.OSEmailSubscriptionState = OSEmailSubscriptionState;
/**
 * An instance of this class describes a change in the user's OneSignal
 * email subscription state, ie. the user subscribed to email with your app.
 */
class OSEmailSubscriptionStateChanges {
    constructor(nativeJson) {
        if (nativeJson.from)
            this.from = new OSEmailSubscriptionState(nativeJson.from);
        if (nativeJson.to)
            this.to = new OSEmailSubscriptionState(nativeJson.to);
    }
}
exports.OSEmailSubscriptionStateChanges = OSEmailSubscriptionStateChanges;
