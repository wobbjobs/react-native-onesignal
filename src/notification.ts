import { OSCreateNotificationBadgeType, OSCreateNotificationDelayOption } from './defines';
import { OneSignal } from './index';

export class OSActionButton {
   /** The custom identifier for this button/action */
   public id : String;

   /** The title for the button */
   public title : String;

   /** Android only - the URL/filename for the icon */
   public icon? : String;

   /** constructor function */
   public constructor(id : String, title : String, icon?: String) {
      this.id = id;
      this.title = title;
   }
   
   public jsonRepresentation() : any {
      return {
         'id' : this.id,
         'title' : this.title,
         'icon' : this.icon
      };
   }
}

export class OSCreateNotification {
   /** 
    * The App ID that the recipient playerIds are registered with 
    * (usually - your app's appId) 
    */
   public appId : String;

   /** An array of user ID's that should receive this notification */
   public playerIds = Array<String>();

   /** The notification's content (excluding title) */
   public content? : String;

   /** 
    * The language code (ie. "en" for English) for this notification
    * defaults to "en" (English)
    */
   public language? : String;

   /** The title/heading for the notification */
   public heading? : String;

   /** The subtitle for the notification (iOS 10+ only) */   
   public subtitle? : String;

   /** Tells the app to launch in the background (iOS only) */
   public contentAvailable? : Boolean;

   /** 
    * Tells the app to launch the Notification Service extension,
    * which can mutate your notification (ie. download attachments)
    */
   public mutableContent? : Boolean;

   /** Additional data you wish to send with the notification */
   public additionalData? : Object;

   /** The URL to open when the user taps the notification */
   public url? : String;

   /**
    * Media (images, videos, etc.) for iOS. Maps a custom
    * ID to a resource URL in the format {'id' : 'https://.....'}
    */
   public iosAttachments? : Map<String, String>;

   /** An image to use as the big picture (android only) */
   public bigPicture? : String;

   /** A list of buttons to attach to the notification */
   public buttons? : Array<OSActionButton>;

   /** 
    * The category identifier for iOS (controls various aspects
    * of the notification, for example, whether to launch a
    * Notification Content Extension) (iOS only)
    */
   public iosCategory? : String;

   /** The sound to play (iOS only) */
   public iosSound? : String;

   /** The sound to play (Android only) */
   public androidSound? : String;

   /** 
    * A small icon (Android only) 
    * Can be a drawable resource name or a URL
   */
   public androidSmallIcon? : String;

   /** 
    * A large icon (Android only) 
    * Can be a drawable resource name or a URL
   */
   public androidLargeIcon? : String;

   /** The Android Oreo Notification Category to send the notification under */
   public androidChannelId? : String;

   /** 
    * Controls if the badge count number overrides the existing badge
    * count (set), or if it is added to the existing count (increase).
    * To decrease, use "increase" with a negative badgeCount
    */
   public iosBadgeType? : OSCreateNotificationBadgeType;

   /** 
    * The actual badge count to either set to directly, or increment by
    * To decrement the user's badge count, send a negative value
    */
   public iosBadgeCount? : Number;

   /** 
    * If multiple notifications have the same collapse ID, only the most
    * recent notification will be shown. (For iOS 12+ thread ID is preferred)
    */
   public collapseId? : String;

   /** Allows you to send a notification at a specific date */
   public sendAfter? : Date;

   /** Allows you to control how the notification is delayed */
   public delayOption? : OSCreateNotificationDelayOption;

   /** 
    * Used in conjunction with delayedOption == timezone, lets you specify what  
    * time of day each user should receive the notification, ie. "9:00 AM"
    */
   public deliveryTimeOfDay? : String;
   
   
   public constructor(notificationAppId : String) {
      this.appId = notificationAppId;
   }
   
   public build() : any {
      var json = { 
         'app_id' : this.appId,
         'include_player_ids' : this.playerIds
      } as any;

      var lang = this.language || "en";
      
      if (this.content) json.contents = { [lang] : this.content }
      if (this.heading) json.headings = { [lang] : this.heading }
      if (this.subtitle) json.subtitle = { [lang] : this.subtitle }
      if (this.contentAvailable) json.content_available = this.contentAvailable
      if (this.mutableContent) json.mutable_content = this.mutableContent;
      if (this.additionalData) json.data = this.additionalData;
      if (this.url) json.url = this.url;
      if (this.iosAttachments) json.ios_attachments = this.iosAttachments;
      if (this.bigPicture) json.big_picture = this.bigPicture;
      if (this.iosCategory) json.ios_category = this.iosCategory;
      if (this.iosSound) json.ios_sound = this.iosSound;
      if (this.androidSound) json.android_sound = this.androidSound;
      if (this.androidSmallIcon) json.small_icon = this.androidSmallIcon;
      if (this.androidLargeIcon) json.large_icon = this.androidLargeIcon;
      if (this.androidChannelId) json.android_channel_id = this.androidChannelId;
      if (this.iosBadgeCount) json.ios_badgeCount = this.iosBadgeCount;
      if (this.collapseId) json.collapse_id = this.collapseId;
      if (this.deliveryTimeOfDay) json.delivery_time_of_day = this.deliveryTimeOfDay;
      if (this.iosBadgeType) json.ios_badgeType = this.iosBadgeType;
      if (this.delayOption) json.delay_option = this.delayOption;
      if (this.buttons) json.buttons = this.buttons.map(button => {
         return button.jsonRepresentation();
      });

      return json;
   }
}

