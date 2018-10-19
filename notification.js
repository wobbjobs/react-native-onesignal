"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_base_1 = require("./notification_base");
class OSNotificationAction {
    constructor(nativeJson) {
        this.type = nativeJson.type;
        this.actionId = nativeJson.id;
    }
}
exports.OSNotificationAction = OSNotificationAction;
class OSNotificationPayload extends notification_base_1.OSNotificationBase {
    constructor(nativeJson) {
        super(nativeJson);
        if (nativeJson.notificationID)
            this.notificationId = nativeJson.notificationID;
        if (nativeJson.templateName)
            this.templateName = nativeJson.templateName;
        if (nativeJson.templateID)
            this.templateId = nativeJson.templateID;
        if (nativeJson.badge)
            this.badgeCount = nativeJson.badge;
        if (nativeJson.badgeIncrement)
            this.iosBadgeIncrement = nativeJson.badgeIncrement;
        if (nativeJson.sound)
            this.sound = nativeJson.sound;
        if (nativeJson.rawPayload)
            this.rawPayload = nativeJson.rawPayload;
    }
}
exports.OSNotificationPayload = OSNotificationPayload;
class OSNotification {
    constructor(nativeJson) {
        this.payload = new OSNotificationPayload(nativeJson.payload);
        this.displayType = nativeJson.displayType;
        this.shown = nativeJson.shown;
        this.appInFocus = nativeJson.appInFocus;
        this.silent = nativeJson.silent;
    }
}
exports.OSNotification = OSNotification;
class OSNotificationOpenedResult {
    constructor(nativeJson) {
        this.notification = new OSNotification(nativeJson.notification);
        this.actionType = nativeJson.type;
    }
}
exports.OSNotificationOpenedResult = OSNotificationOpenedResult;
