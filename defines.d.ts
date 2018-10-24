export declare enum OSEvent {
    received = "OneSignal#received",
    opened = "OneSignal#opened",
    subscription = "OneSignal#subscription",
    permission = "OneSignal#permission",
    emailSubscription = "OneSignal#emailSubscription",
}
export declare enum OSLogLevel {
    none = 0,
    fatal = 1,
    error = 2,
    warn = 3,
    info = 4,
    debug = 5,
    verbose = 6,
}
export declare enum OSNotificationPermission {
    notDetermined = 0,
    denied = 1,
    authorized = 2,
    provisional = 3,
}
export declare enum OSNotificationActionType {
    opened = 0,
    actionTaken = 1,
}
export declare enum OSNotificationDisplayType {
    none = 0,
    alert = 1,
    notification = 2,
}
export declare enum OSCreateNotificationBadgeType {
    set = "SetTo",
    increase = "Increase",
}
export declare enum OSCreateNotificationDelayOption {
    timezone = "timezone",
    lastActive = "last_active",
}
export declare const Events: OSEvent[];
