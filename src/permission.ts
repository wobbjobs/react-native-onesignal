import { OSNotificationPermission } from './defines';
import { OSSubscriptionState, OSEmailSubscriptionState } from 'react-native-onesignal/src/subscription';

export class OSPermissionState {
   /** 
    * iOS only. Indicates if the user has been prompted to 
    * allow push notifications.
    */
   public hasPrompted = false;

   /** 
    * iOS only. Indicates if the app is currently using
    * 'provisional' authorization, meaning the app can
    * send notifications without asking for permission
    * but notifications go directly to notification center.
    */
   public provisional = false;

   /** The user's current notification permission status */
   public status = OSNotificationPermission.notDetermined;

   public constructor(nativeJson : any) {
      if (nativeJson.status) {
         //ios
         this.status = nativeJson.status;
      } else if (nativeJson.enabled) {
         //android
         let enabled = nativeJson.enabled as boolean;
         this.status = enabled ? OSNotificationPermission.authorized : OSNotificationPermission.denied;
      }

      if (nativeJson.provisional) this.provisional = nativeJson.provisional as boolean;
      
      if (nativeJson.hasPrompted) this.hasPrompted = nativeJson.hasPrompted as boolean;
   }
}

export class OSPermissionSubscriptionState {
   /** 
    * The current permission/authorization state (ie. did the user
    * tap 'Allow' on the Allow Notifications prompt in iOS)
    */
   public permissionStatus? : OSPermissionState;

   /** The state of the user's push subscription with OneSignal */
   public subscriptionStatus? : OSSubscriptionState;

   /** The state of the user's email subscription with OneSignal */
   public emailSubscriptionStatus? : OSEmailSubscriptionState;

   public constructor(nativeJson : any) {
      console.log("permission subscription state");
      console.log(nativeJson);
      this.permissionStatus = new OSPermissionState(nativeJson.permissionStatus);
      this.subscriptionStatus = new OSSubscriptionState(nativeJson.subscriptionStatus);
      this.emailSubscriptionStatus = new OSEmailSubscriptionState(nativeJson.emailSubscriptionStatus);
   }
}

export class OSPermissionStateChanges {
   /** The permission state before the change */
   public from? : OSPermissionState;

   /** The new/updated permission state */
   public to? : OSPermissionState;

   public constructor(nativeJson : any) {
      if (nativeJson.from) this.from = new OSPermissionState(nativeJson.from);
      if (nativeJson.to) this.to = new OSPermissionState(nativeJson.to);
   }
}