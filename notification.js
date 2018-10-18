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
        console.log("Constructing notification from json: ");
        console.log(nativeJson);
        super(nativeJson);
        if (nativeJson.hasOwnProperty('notificationID'))
            this.notificationId = nativeJson.notificationID;
        if (nativeJson.hasOwnProperty('templateName'))
            this.templateName = nativeJson.templateName;
        if (nativeJson.hasOwnProperty('templateID'))
            this.templateId = nativeJson.templateID;
        if (nativeJson.hasOwnProperty('badge'))
            this.badgeCount = nativeJson.badge;
        if (nativeJson.hasOwnProperty('badgeIncrement'))
            this.iosBadgeIncrement = nativeJson.badgeIncrement;
        if (nativeJson.hasOwnProperty('sound'))
            this.sound = nativeJson.sound;
        if (nativeJson.hasOwnProperty('rawPayload'))
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
