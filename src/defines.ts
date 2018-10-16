
export enum OSEvent {
   received = "OneSignal#received",
   opened = "OneSignal#opened",
   subscription = "OneSignal#subscription",
   permission = "OneSignal#permission",
   emailSubscription = "OneSignal#emailSubscription"
}

export enum OSLogLevel {
   none = 0,
   fatal,
   error,
   warn,
   info,
   debug,
   verbose,
}

export enum OSNotificationActionType {
   opened = 0,
   actionTaken,
}

export enum OSNotificationDisplayType {
   none = 0,
   alert,
   notification,
}

export enum OSCreateNotificationBadgeType {
   set = "SetTo",
   increase = "Increase"
}

export enum OSCreateNotificationDelayOption {
   timezone = "timezone",
   lastActive = "last_active"
}

export const Events = [OSEvent.received, OSEvent.opened, OSEvent.subscription, OSEvent.permission, OSEvent.emailSubscription];