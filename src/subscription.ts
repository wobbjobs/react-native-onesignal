export class OSSubscriptionState {
   /**
    * Indicates if you have ever called setSubscription(false) 
    * to disable notifications for this user.
    */
   public userSubscriptionSetting : Boolean;

   /** 
    * A boolean parameter that indicates if the user
    * is subscribed to your app with OneSignal. This
    * is only true if the `userId`, `pushToken`, and
    * `userSubscriptionSetting` parameters are defined
    * or true
    */
   public subscribed : Boolean;

   /** 
    * The current user's userId with OneSignal 
    * Also known as 'playerId'
    */
   public userId? : String;

   /** The APNS (iOS) or GCM/FCM (Android) push token */
   public pushToken? : String;

   public constructor(nativeJson : any) {
      this.userSubscriptionSetting = nativeJson.userSubscriptionSetting;
      this.subscribed = nativeJson.subscribed;
      this.userId = nativeJson.userId;
      this.pushToken = nativeJson.pushToken;
   }
}

/**
 * An instance of this class describes a change in the user's OneSignal
 * push notification subscription state, ie. the user subscribed to
 * push notifications with your app.
 */
export class OSSubscriptionStateChanges {
   /** The previous state of the subscription */
   public from? : OSSubscriptionState;
   
   /** The current subscription state */
   public to? : OSSubscriptionState;
   
   public constructor(nativeJson : any) {
      if (nativeJson.from) this.from = new OSSubscriptionState(nativeJson.from);
      if (nativeJson.to) this.to = new OSSubscriptionState(nativeJson.to);
   }
}

export class OSEmailSubscriptionState {
   /** 
    * Indicates if the user's email has been set with OneSignal
    * and the user has been assigned a OneSignal email userID
    */
   public subscribed : Boolean;

   /** The user ID for this user's email record with OneSignal */
   public emailUserId? : String;

   /** The user's email address */
   public emailAddress? : String;

   public constructor(nativeJson : any) {
      this.subscribed = nativeJson.subscribed;
      this.emailUserId = nativeJson.emailUserId;
      this.emailAddress = nativeJson.emailAddress;
   }
}

/**
 * An instance of this class describes a change in the user's OneSignal
 * email subscription state, ie. the user subscribed to email with your app.
 */
export class OSEmailSubscriptionStateChanges {
   /** The previous state of the subscription */
   public from? : OSEmailSubscriptionState;

   /** The current subscription state */
   public to? : OSEmailSubscriptionState;

   public constructor(nativeJson : any) {
      if (nativeJson.from) this.from = new OSEmailSubscriptionState(nativeJson.from);
      if (nativeJson.to) this.to = new OSEmailSubscriptionState(nativeJson.to);
   }
}