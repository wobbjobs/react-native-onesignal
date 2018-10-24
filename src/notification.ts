import { OSActionButton, OSNotificationBase } from './notification_base';
import { OSCreateNotification } from './create_notification';
import { OSNotificationDisplayType, OSNotificationActionType } from './defines';

export class OSNotificationAction {
   /**
    * Indicates if the notification was "opened", or if
    * a specific action button was pressed "actionTaken"
    */
   public type: OSNotificationActionType;

   /** If a button was pressed, this will be the button/action ID */
   public actionId: string;

   public constructor(nativeJson : any) {
      this.type = nativeJson.type;

      this.actionId = nativeJson.id;
   }
}

export class OSNotificationPayload extends OSNotificationBase {
   /** The OneSignal Notification ID */
   public notificationId? : string;

   /** 
    * The name of the template used to create 
    * this notification (if applicable)
    */
   public templateName? : string;

   /** 
    * The ID of the template used to create
    * this notification (if applicable)
    */
   public templateId? : string;

   /** The badge count */
   public badgeCount? : number;

   /** 
    * The badge increment - if the existing badge count
    * is being incremented (ie. +1) this is used instead
    * of the 'badgeCount' parameter
    */
   public iosBadgeIncrement? : number;

   /** The sound played for this notification */
   public sound? : string;

   /** The raw notification payload */
   public rawPayload? : any;

   public constructor(nativeJson : any) {
      super(nativeJson);
      
      if (nativeJson.notificationID) this.notificationId = nativeJson.notificationID;
      if (nativeJson.templateName) this.templateName = nativeJson.templateName;
      if (nativeJson.templateID) this.templateId = nativeJson.templateID;
      if (nativeJson.badge) this.badgeCount = nativeJson.badge;
      if (nativeJson.badgeIncrement) this.iosBadgeIncrement = nativeJson.badgeIncrement;
      if (nativeJson.sound) this.sound = nativeJson.sound;
      if (nativeJson.rawPayload) this.rawPayload = nativeJson.rawPayload;
   }
}

export class OSNotification {
   public payload : OSNotificationPayload;

   public displayType : OSNotificationDisplayType;

   public shown : boolean;

   public appInFocus : boolean;

   public silent : boolean;

   constructor(nativeJson : any) {
      this.payload = new OSNotificationPayload(nativeJson.payload);
      this.displayType = nativeJson.displayType;
      this.shown = nativeJson.shown;
      this.appInFocus = nativeJson.appInFocus;
      this.silent = nativeJson.silent;
   }
}

export class OSNotificationOpenedResult {
   public notification : OSNotification;

   public actionType? : OSNotificationActionType;
   
   public constructor(nativeJson : any) {
      this.notification = new OSNotification(nativeJson.notification);

      this.actionType = nativeJson.type;
   }
}