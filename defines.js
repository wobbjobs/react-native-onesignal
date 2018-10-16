"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OSEvent;
(function (OSEvent) {
    OSEvent["received"] = "OneSignal#received";
    OSEvent["opened"] = "OneSignal#opened";
    OSEvent["subscription"] = "OneSignal#subscription";
    OSEvent["permission"] = "OneSignal#permission";
    OSEvent["emailSubscription"] = "OneSignal#emailSubscription";
})(OSEvent = exports.OSEvent || (exports.OSEvent = {}));
var OSLogLevel;
(function (OSLogLevel) {
    OSLogLevel[OSLogLevel["none"] = 0] = "none";
    OSLogLevel[OSLogLevel["fatal"] = 1] = "fatal";
    OSLogLevel[OSLogLevel["error"] = 2] = "error";
    OSLogLevel[OSLogLevel["warn"] = 3] = "warn";
    OSLogLevel[OSLogLevel["info"] = 4] = "info";
    OSLogLevel[OSLogLevel["debug"] = 5] = "debug";
    OSLogLevel[OSLogLevel["verbose"] = 6] = "verbose";
})(OSLogLevel = exports.OSLogLevel || (exports.OSLogLevel = {}));
var OSNotificationActionType;
(function (OSNotificationActionType) {
    OSNotificationActionType[OSNotificationActionType["opened"] = 0] = "opened";
    OSNotificationActionType[OSNotificationActionType["actionTaken"] = 1] = "actionTaken";
})(OSNotificationActionType = exports.OSNotificationActionType || (exports.OSNotificationActionType = {}));
var OSNotificationDisplayType;
(function (OSNotificationDisplayType) {
    OSNotificationDisplayType[OSNotificationDisplayType["none"] = 0] = "none";
    OSNotificationDisplayType[OSNotificationDisplayType["alert"] = 1] = "alert";
    OSNotificationDisplayType[OSNotificationDisplayType["notification"] = 2] = "notification";
})(OSNotificationDisplayType = exports.OSNotificationDisplayType || (exports.OSNotificationDisplayType = {}));
var OSCreateNotificationBadgeType;
(function (OSCreateNotificationBadgeType) {
    OSCreateNotificationBadgeType["set"] = "SetTo";
    OSCreateNotificationBadgeType["increase"] = "Increase";
})(OSCreateNotificationBadgeType = exports.OSCreateNotificationBadgeType || (exports.OSCreateNotificationBadgeType = {}));
var OSCreateNotificationDelayOption;
(function (OSCreateNotificationDelayOption) {
    OSCreateNotificationDelayOption["timezone"] = "timezone";
    OSCreateNotificationDelayOption["lastActive"] = "last_active";
})(OSCreateNotificationDelayOption = exports.OSCreateNotificationDelayOption || (exports.OSCreateNotificationDelayOption = {}));
exports.Events = [OSEvent.received, OSEvent.opened, OSEvent.subscription, OSEvent.permission, OSEvent.emailSubscription];
