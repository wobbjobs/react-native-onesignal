import { OSCreateNotificationBadgeType, OSCreateNotificationDelayOption } from './defines';
import { OSActionButton, OSNotificationBase } from './notification_base';

export class OSCreateNotification extends OSNotificationBase {
   /** 
    * The App ID that the recipient playerIds are registered with 
    * (usually - your app's appId) 
    */
   public appId : String;

   /** The two-character language code (ie. "en" by default) */
   public language = "en";
   
   /** the language for the notification ("en" by default) */

   /** An array of user ID's that should receive this notification */
   public playerIds = Array<String>();

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

   /** The sound to play (iOS only) */
   public iosSound? : String;

   /** The sound to play (Android only) */
   public androidSound? : String;
   
   public constructor(notificationAppId : String) {
      super({});
      this.appId = notificationAppId;
   }
   
   // builds the notification into a OneSignal API payload
   public build() : any {
      var json = { 
         'app_id' : this.appId,
         'include_player_ids' : this.playerIds
      } as any;
      
      if (this.content) json.contents = { [this.language] : this.content };
      if (this.heading) json.headings = { [this.language] : this.heading };
      if (this.subtitle) json.subtitle = { [this.language] : this.subtitle };
      if (this.contentAvailable) json.content_available = this.contentAvailable;
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
