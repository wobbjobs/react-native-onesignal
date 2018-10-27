import { NativeModules } from 'react-native';

export class OneSignalMockNativeModule {
   public consentGranted = false;

   public initWithAppId(appId : String, settings: any) {

   }

   public init(appId : String) {

   }

   public log(level : number, message: string) {

   }

   public promptForPushNotificationPermission(callback : Function) {

   }

   public getTags(callback: Function) {

   }

   public sendTags(tags: any, callback: Function) {

   }

   public deleteTags(keys: Array<String>, callback: Function) {

   }

   public enableVibrate(enable: boolean) {

   }

   public enableSound(enable: boolean) {

   }

   public setEmail(email: string, authCode: string, callback: Function) {

   }

   public logoutEmail(callback: Function) {

   }

   public setLocationShared(shared: boolean) {

   }

   public setSubscription(enabled: boolean) {

   }

   public promptLocation() {

   }

   public setInFocusDisplayType(type: number) {

   }

   public postNotification(notification : any, callback: Function) {

   }

   public clearOneSignalNotifications() {

   }

   public cancelNotification(id: number) {

   }

   public setLogLevel(consoleLevel: number, visualLevel: number) {

   }

   public setRequiresUserPrivacyConsent(required: boolean) {

   }

   public provideUserConsent(granted: boolean) {

   }

   public async userProvidedPrivacyConsent() : Promise<boolean> {
      return this.consentGranted;
   }

   public presentAppSettings() {

   }
   
   public async getPermissionSubscriptionState() : Promise<any> {
      return {};
   }
}

const mockModule = new OneSignalMockNativeModule();

NativeModules.OneSignal = {
   initWithAppId: jest.fn(mockModule.initWithAppId),
   init: jest.fn(mockModule.init),
   log: jest.fn(mockModule.log),
   promptForPushNotificationPermission: jest.fn(mockModule.promptForPushNotificationPermission),
   getTags: jest.fn(mockModule.getTags),
   sendTags: jest.fn(mockModule.sendTags),
   deleteTags: jest.fn(mockModule.deleteTags),
   enableVibrate: jest.fn(mockModule.enableVibrate),
   enableSound: jest.fn(mockModule.enableSound),
   setEmail: jest.fn(mockModule.setEmail),
   logoutEmail: jest.fn(mockModule.logoutEmail),
   setLocationShared: jest.fn(mockModule.setLocationShared),
   setSubscription: jest.fn(mockModule.setSubscription),
   promptLocation: jest.fn(mockModule.promptLocation),
   setInFocusDisplayType: jest.fn(mockModule.setInFocusDisplayType),
   postNotification: jest.fn(mockModule.postNotification),
   clearOneSignalNotifications: jest.fn(mockModule.clearOneSignalNotifications),
   cancelNotification: jest.fn(mockModule.cancelNotification),
   setLogLevel: jest.fn(mockModule.setLogLevel),
   setRequiresUserPrivacyConsent: jest.fn(mockModule.setRequiresUserPrivacyConsent),
   provideUserConsent: jest.fn(mockModule.provideUserConsent),
   userProvidedPrivacyConsent: jest.fn(mockModule.userProvidedPrivacyConsent),
   presentAppSettings: jest.fn(mockModule.presentAppSettings),
   getPermissionSubscriptionState: jest.fn(mockModule.getPermissionSubscriptionState)
}