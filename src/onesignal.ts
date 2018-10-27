import { NativeModules, NativeEventEmitter, NetInfo, Platform, NativeModulesStatic, EmitterSubscription } from 'react-native';
import invariant from 'invariant';
import { OSEvent, OSLogLevel, OSNotificationDisplayType, OSNotificationActionType, Events } from './defines';
import { OSActionButton } from './notification_base';
import { OSCreateNotification } from './create_notification';
import { OSNotificationPayload, OSNotification, OSNotificationOpenedResult } from './notification';
import { OSSubscriptionState, OSEmailSubscriptionState, OSSubscriptionStateChanges, OSEmailSubscriptionStateChanges } from './subscription';
import { OSPermissionState, OSPermissionSubscriptionState, OSPermissionStateChanges } from './permission';

/** Define the native module */
const OSNativeModule = NativeModules.OneSignal;

export class OneSignal {
   /**
    * Holds a reference to the native event emitter, which 
    * lets the SDK get events from the native SDK's (iOS and Android)
    */
   private eventEmitter : NativeEventEmitter;

   /**
    * Maps event names to event emitter subscriptions.
    */
   private listeners = new Map<string, EmitterSubscription>();

   /**
    * Maps event names to the app's added event listeners 
    * (eg. using OneSignal.addSubscriptionListener() etc.)
    */
   private eventSubscribers = new Map<string, Array<Function>>();

   /**
    * Holds a cache of events that were received before the
    * app added a subscriber for the event
    */
   private cachedEvents = new Map<string, Array<any>>();

   /**
    * Initializes the OneSignal SDK.
    * 
    * @param appId The OneSignal App ID for your application.
    * @param iOSSettings iOS-specific to control various settings, such as whether
    *    or not to prompt users before opening a push notification URL webview
    */
   public constructor(appId : string, iOSSettings : Object) {
      this.eventEmitter = new NativeEventEmitter(OSNativeModule);
         
      this.setupObservers();
      
      if (Platform.OS == 'ios') {
         OSNativeModule.initWithAppId(appId, iOSSettings);
      } else {
         OSNativeModule.init(appId);
      }
   }
   
   private addPrivateObserver(event: string, handler: (...args: any[]) => any) {
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

   private fireObservers<T>(event: string, object : T) {
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
         let changes = new OSPermissionStateChanges(object);

         this.fireObservers(OSEvent.permission, changes);
      });

      this.addPrivateObserver(OSEvent.emailSubscription, object => {
         let changes = new OSEmailSubscriptionStateChanges(object);

         this.fireObservers(OSEvent.emailSubscription, changes);
      });
   }

   private onesignalLog(level : OSLogLevel, message : string) {
      OSNativeModule.log(level, message);
   }

   /**
    * Adds an observer that fires whenever a notification is received.
    * NOTE: This function may not fire reliably if your app is closed.
    * 
    * @param handler The callback/function that fires when a notification
    * is received.
    */
   public addNotificationReceivedObserver(handler : (notification: OSNotification) => void) {
      this.addObserver(OSEvent.received, handler);
   }

   /**
    * Adds an observer that fires when a notification is opened.
    * 
    * @param handler : The callback/function that fires when a 
    * notification is opened
    */
   public addNotificationOpenedObserver(handler : (openResult: OSNotificationOpenedResult) => void) {
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
   public addSubscriptionObserver(handler : (changes: OSSubscriptionStateChanges) => void) {
      this.addObserver(OSEvent.subscription, handler);
   }

   /**
    * This observer fires when the user's push permission changes. For example,
    * if the user in iOS accepts push notification permission, this observer fires.
    * 
    * @param handler The callback/function that fires when permission changes.
    */
   public addPermissionObserver(handler : (changes: OSPermissionStateChanges) => void) {
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
   public addEmailSubscriptionObserver(handler : (changes: OSEmailSubscriptionStateChanges) => void) {
      this.addObserver(OSEvent.emailSubscription, handler);
   }

   /**
    * Clears all event observers/listeners
    */
   public clearObservers() {
      this.listeners.forEach((subscription, eventName) => {
         this.eventEmitter.removeSubscription(subscription);
      });

      this.listeners.clear();
   }

   /**
    * iOS-only. 
    * Prompts for push notification permission. Replaces registerForPushNotifications()
    */
   public promptForPushNotificationPermission(callback? : Function) {
      if (Platform.OS == 'ios') {
         OSNativeModule.promptForPushNotificationPermission(callback || function(){});
      } else {
         this.onesignalLog(OSLogLevel.warn, "promptForPushNotificationPermission() is only applicable in iOS.");
      }
   }

   /** 
    * Returns an instance of OSPermissionSubscriptionState
    */
   public async getPermissionSubscriptionState() : Promise<OSPermissionSubscriptionState> {
      return new OSPermissionSubscriptionState(await OSNativeModule.getPermissionSubscriptionState());
   }

   public getTags(callback : (tags : any) => void) {
      OSNativeModule.getTags(callback || function(){});
   }

   public sendTag(key : string, value : any, callback? : Function) {
      this.sendTags({key : value}, callback || function(){});
   }

   public sendTags(tags : any, callback? : Function) {
      OSNativeModule.sendTags(tags, callback || function(){});
   }

   public deleteTags(keys : Array<string>, callback? : Function) {
      OSNativeModule.deleteTags(keys, callback || function(){});
   }

   public deleteTag(key : string, callback? : Function) {
      this.deleteTags([key], callback || function(){});
   }

   public enableAndroidVibrate(enable : boolean) {
      if (Platform.OS == 'android') {
         OSNativeModule.enableVibrate(enable);
      } else {
         this.onesignalLog(OSLogLevel.warn, "enableAndroidVibrate() is not available in iOS.");
      }
   }

   public enableAndroidSound(enable : boolean) {
      if (Platform.OS == 'android') {
         OSNativeModule.enableSound(enable);
      } else {
         this.onesignalLog(OSLogLevel.warn, "enableAndroidSound() is not available in iOS.");
      }
   }

   public setEmail(email : string, emailAuthCode? : string, callback? : Function) {
      OSNativeModule.setEmail(email, emailAuthCode, callback || function(){});
   }

   public logoutEmail(callback? : Function) {
      OSNativeModule.logoutEmail(callback || function(){});
   }

   public setLocationShared(shared : boolean) {
      OSNativeModule.setLocationShared(shared);
   }

   public setSubscription(enabled : boolean) {
      OSNativeModule.setSubscription(enabled);
   }

   public promptLocation() {
      OSNativeModule.promptLocation();
   }

   public setInFocusDisplayType(type : OSNotificationDisplayType) {
      OSNativeModule.setInFocusDisplayType(type);
   }

   public postNotification(notification : OSCreateNotification, callback? : Function) {
      OSNativeModule.postNotification(notification.build(), callback || function(){});
   }

   public clearOneSignalAndroidNotifications() {
      if (Platform.OS == 'android') {
         OSNativeModule.clearOneSignalNotifications();
      } else {
         this.onesignalLog(OSLogLevel.warn, 'clearOneSignalAndroidNotifications() is not available in iOS');
      }
   }

   public cancelAndroidNotification(notificationId : Number) {
      if (Platform.OS == 'android') {
         OSNativeModule.cancelNotification(notificationId);
      } else {
         this.onesignalLog(OSLogLevel.warn, 'cancelAndroidNotification() is not available in iOS.');
      }
   }

   public setLogLevel(consoleLevel : OSLogLevel, visualLogLevel : OSLogLevel) {
      OSNativeModule.setLogLevel(consoleLevel, visualLogLevel);
   }

   public setRequiresUserPrivacyConsent(required : boolean) {
      OSNativeModule.setRequiresUserPrivacyConsent(required);
   }

   public provideUserPrivacyConsent(granted = true) {
      OSNativeModule.provideUserConsent(granted);
   }

   public userProvidedPrivacyConsent() : boolean {
      return OSNativeModule.userProvidedPrivacyConsent();
   }

   public presentAppNotificationSettings() {
      if (Platform.OS == 'ios') {
         OSNativeModule.presentAppSettings();
      } else {
         this.onesignalLog(OSLogLevel.warn, 'presentAppNotificationSettings() is only available in iOS.');
      }
   }
}
