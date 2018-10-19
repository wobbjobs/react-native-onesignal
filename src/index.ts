import { NativeModules, NativeEventEmitter, NetInfo, Platform, NativeModulesStatic, EmitterSubscription } from 'react-native';
import invariant from 'invariant';
import { OSEvent, OSLogLevel, OSNotificationDisplayType, OSNotificationActionType, Events } from './defines';
import { OSActionButton } from './notification_base';
import { OSCreateNotification } from './create_notification';
import { OSNotificationPayload, OSNotification, OSNotificationOpenedResult } from './notification';
import { OSSubscriptionState, OSEmailSubscriptionState, OSSubscriptionStateChanges, OSEmailSubscriptionStateChanges } from './subscription';

/** Publicly export enums defined in defines.ts */
export { OSLogLevel, OSNotificationActionType, OSNotificationDisplayType, OSCreateNotificationBadgeType } from './defines';
export { OSCreateNotification } from './create_notification';
export { OSActionButton } from './notification_base';
export { OSNotificationPayload, OSNotification } from './notification';

/** Define the native module */
const RNOneSignal = NativeModules.OneSignal;

export class OneSignal {
   /**
    * Declares a singleton instance that represents OneSignal's React-Native SDK
    */
   public static shared = new OneSignal();

   /**
    * Holds a reference to the native event emitter, which 
    * lets the SDK get events from the native SDK's (iOS and Android)
    */
   private eventEmitter : NativeEventEmitter;

   /**
    * Maps event names to event emitter subscriptions.
    */
   private listeners = new Map<String, EmitterSubscription>();

   /**
    * Maps event names to the app's added event listeners 
    * (eg. using OneSignal.addSubscriptionListener() etc.)
    */
   private eventSubscribers = new Map<String, Array<Function>>();

   /**
    * Holds a cache of events that were received before the
    * app added a subscriber for the event
    */
   private cachedEvents = new Map<String, Array<any>>();

   constructor() {
      this.eventEmitter = new NativeEventEmitter(RNOneSignal);
         
      this.setupObservers();
   }
   
   private addPrivateObserver(event: string, handler: Function) {
      this.listeners.set(event, this.eventEmitter.addListener(event, object => {
         handler(object);
      }));
   }

   private addObserver(event: string, handler : Function) {
      let eventObservers = this.eventSubscribers.get(event);

      if (eventObservers && eventObservers.length > 0) {
         eventObservers.push(handler);
         this.eventSubscribers.set(event, eventObservers);
      } else {
         this.eventSubscribers.set(event, [handler]);
      }
   }

   private fireObservers<T>(event: String, object : T) {
      let handlers = this.eventSubscribers.get(event);

      if (handlers && handlers.length > 0) {
         handlers.forEach(handler => {
            handler(object);
         });
      } else {
         var existing = this.cachedEvents.get(event);

         if (existing) {
            existing.push(object);
            this.cachedEvents.set(event, existing);
         } else {
            this.cachedEvents.set(event, [object]);
         }
      }
   }
   
   private setupObservers() {
      this.addPrivateObserver(OSEvent.received, object => {
         let notification = new OSNotification(object);

         this.fireObservers(OSEvent.received, notification);
      });

      this.addPrivateObserver(OSEvent.opened, object => {
         let result = new OSNotificationOpenedResult(object);

         this.fireObservers(OSEvent.opened, result);
      });

      this.addPrivateObserver(OSEvent.subscription, object => {
         let changes = new OSSubscriptionStateChanges(object);

         this.fireObservers(OSEvent.subscription, changes);
      });

      this.addPrivateObserver(OSEvent.permission, object => {
         let changes = new OSEmailSubscriptionStateChanges(object);

         this.fireObservers(OSEvent.emailSubscription, changes);
      });

      this.addPrivateObserver(OSEvent.emailSubscription, object => {

      });
   }

   private onesignalLog(level : OSLogLevel, message : String) {
      RNOneSignal.log(level, message);
   }

   /**
    * Adds an observer that fires whenever a notification is received.
    * NOTE: This function may not fire reliably if your app is closed.
    * 
    * @param handler The callback/function that fires when a notification
    * is received.
    */
   public addNotificationReceivedObserver(handler : Function) {
      this.addObserver(OSEvent.received, handler);
   }

   /**
    * Adds an observer that fires when a notification is opened.
    * 
    * @param handler : The callback/function that fires when a 
    * notification is opened
    */
   public addNotificationOpenedObserver(handler : Function) {
      this.addObserver(OSEvent.opened, handler);
   }

   /**
    * This observer fires whenever the user's push notification subscription
    * state changes with regards to OneSignal. For example, when the user
    * is registered with OneSignal and gets a userId, this observer fires.
    * 
    * @param handler The callback/function that fires when the 
    * user's push notification subscription state changes.
    */
   public addSubscriptionObserver(handler : Function) {
      this.addObserver(OSEvent.subscription, handler);
   }

   /**
    * This observer fires when the user's push permission changes. For example,
    * if the user in iOS accepts push notification permission, this observer fires.
    * 
    * @param handler The callback/function that fires when permission changes.
    */
   public addPermissionObserver(handler : Function) {
      this.addObserver(OSEvent.permission, handler);
   }

   /**
    * This observer fires when the user's email subscription state changes. For
    * example, when the user uses setEmail() and is assigned an email userId, 
    * this observer will fire.
    * 
    * @param handler The callback/function that fires when the email subscription
    * state changes.
    */
   public addEmailSubscriptionObserver(handler : Function) {
      this.addObserver(OSEvent.emailSubscription, handler);
   }

   /**
    * Clears all event observers/listeners
    */
   public clearObservers() {
      this.eventSubscribers.clear();
   }

   /**
    * iOS-only. 
    * Prompts for push notification permission. Replaces registerForPushNotifications()
    */
   public promptForPushNotificationPermission(callback? : Function) {
      if (Platform.OS == 'ios') {
         RNOneSignal.promptForPushNotificationPermission(callback || function(){});
      } else {
         this.onesignalLog(OSLogLevel.warn, "promptForPushNotificationPermission() is only applicable in iOS.");
      }
   }

   /**
    * Initializes the OneSignal SDK.
    * 
    * @param appId The OneSignal App ID for your application.
    * @param iOSSettings iOS-specific to control various settings, such as whether
    *    or not to prompt users before opening a push notification URL webview
    */
   public init(appId : String, iOSSettings : Object) {
      if (Platform.OS == 'ios') {
         RNOneSignal.initWithAppId(appId, iOSSettings);
      } else {
         RNOneSignal.init(appId);
      }
   }

   public getPermissionSubscriptionState(callback? : Function) {
      RNOneSignal.getPermissionSubscriptionState(callback || function(){});
   }

   public sendTag(key : String, value : any, callback? : Function) {
      this.sendTags({key : value}, callback || function(){});
   }

   public sendTags(tags : Object, callback? : Function) {
      RNOneSignal.sendTags(tags, callback || function(){});
   }

   public deleteTags(keys : Array<String>, callback? : Function) {
      RNOneSignal.deleteTags(keys, callback || function(){});
   }

   public deleteTag(key : String, callback? : Function) {
      this.deleteTags([key], callback || function(){});
   }

   public enableAndroidVibrate(enable : Boolean) {
      if (Platform.OS == 'android') {
         RNOneSignal.enableVibrate(enable);
      } else {
         this.onesignalLog(OSLogLevel.warn, "enableAndroidVibrate() is not available in iOS.");
      }
   }

   public enableAndroidSound(enable : Boolean) {
      if (Platform.OS == 'android') {
         RNOneSignal.enableSound(enable);
      } else {
         this.onesignalLog(OSLogLevel.warn, "enableAndroidSound() is not available in iOS.");
      }
   }

   public setEmail(email : String, emailAuthCode? : String, callback? : Function) {
      RNOneSignal.setEmail(email, emailAuthCode, callback || function(){});
   }

   public logoutEmail(callback? : Function) {
      RNOneSignal.logoutEmail(callback || function(){});
   }

   public setLocationShared(shared : Boolean) {
      RNOneSignal.setLocationShared(shared);
   }

   public setSubscription(enabled : Boolean) {
      RNOneSignal.setSubscription(enabled);
   }

   public promptLocation() {
      RNOneSignal.promptLocation();
   }

   public setInFocusDisplayType(type : OSNotificationDisplayType) {
      RNOneSignal.setInFocusDisplayType(type);
   }

   public postNotification(notification : OSCreateNotification, callback? : Function) {
      RNOneSignal.postNotification(notification.build(), callback || function(){});
   }

   public clearOneSignalAndroidNotifications() {
      if (Platform.OS == 'android') {
         RNOneSignal.clearOneSignalNotifications();
      } else {
         this.onesignalLog(OSLogLevel.warn, 'clearOneSignalAndroidNotifications() is not available in iOS');
      }
   }

   public cancelAndroidNotification(notificationId : Number) {
      if (Platform.OS == 'android') {
         RNOneSignal.cancelNotification(notificationId);
      } else {
         this.onesignalLog(OSLogLevel.warn, 'cancelAndroidNotification() is not available in iOS.');
      }
   }

   public setLogLevel(consoleLevel : OSLogLevel, visualLogLevel : OSLogLevel) {
      RNOneSignal.setLogLevel(consoleLevel, visualLogLevel);
   }

   public setRequiresUserPrivacyConsent(required : Boolean) {
      RNOneSignal.setRequiresUserPrivacyConsent(required);
   }

   public provideUserPrivacyConsent(granted = true) {
      RNOneSignal.provideUserConsent(granted);
   }

   public userProvidedPrivacyConsent() : Boolean {
      return RNOneSignal.userProvidedPrivacyConsent();
   }

   public presentAppNotificationSettings() {
      if (Platform.OS == 'ios') {
         RNOneSignal.presentAppSettings();
      } else {
         this.onesignalLog(OSLogLevel.warn, 'presentAppNotificationSettings() is only available in iOS.');
      }
   }
}
