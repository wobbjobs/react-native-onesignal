#import "RCTOneSignalCategories.h"

/*
 The OneSignal iOS SDK implements similar methods (`toDictionary`)
 However we decided to implement custom `toJson` methods for several
 of these objects to add more properties.
 
 TODO: Update the native iOS SDK to add these details
 (ie. `templateId` is missing from OSNotificationPayload's `toDictionary`
 method in the native SDK) and remove them from here.
 */

@implementation OSNotification (ReactNative)
- (NSDictionary *)toJson {
    NSMutableDictionary *json = [NSMutableDictionary new];
    
    json[@"payload"] = [self.payload toJson];
    json[@"displayType"] = @((int)self.displayType);
    json[@"shown"] = @(self.shown);
    json[@"appInFocus"] = @(self.isAppInFocus);
    json[@"silent"] = @(self.silentNotification);
    
    return json;
}
@end

@implementation OSNotificationPayload (ReactNative)
-(NSDictionary *)toJson {
    NSMutableDictionary *json = [NSMutableDictionary new];
    
    json[@"contentAvailable"] = @(self.contentAvailable);
    json[@"mutableContent"] = @(self.mutableContent);
    
    NSError *jsonError;
    if (self.rawPayload) {
        NSData *data = [NSJSONSerialization dataWithJSONObject:self.rawPayload options:NSJSONWritingPrettyPrinted error:&jsonError];
        
        if (!jsonError) {
            NSString *rawPayloadString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            
            if (self.rawPayload) json[@"rawPayload"] = rawPayloadString;
        }
    }
    
    if (self.notificationID) json[@"notificationId"] = self.notificationID;
    if (self.templateName) json[@"templateName"] = self.templateName;
    if (self.templateID) json[@"templateId"] = self.templateID;
    if (self.badge) json[@"badge"] = @(self.badge);
    if (self.badgeIncrement) json[@"badgeIncrement"] = @(self.badgeIncrement);
    if (self.sound) json[@"sound"] = self.sound;
    if (self.title) json[@"title"] = self.title;
    if (self.subtitle) json[@"subtitle"] = self.subtitle;
    if (self.body) json[@"body"] = self.body;
    if (self.launchURL) json[@"launchUrl"] = self.launchURL;
    if (self.additionalData) json[@"additionalData"] = self.additionalData;
    if (self.attachments) json[@"attachments"] = self.attachments;
    if (self.actionButtons) json[@"buttons"] = self.actionButtons;
    if (self.category) json[@"category"] = self.category;
    if (self.threadId) json[@"threadId"] = self.threadId;
    
    return json;
}
@end

@implementation OSNotificationOpenedResult (ReactNative)
- (NSDictionary *)toJson {
    NSMutableDictionary *json = [NSMutableDictionary new];
    
    if (self.notification) json[@"notification"] = self.notification.toJson;
    if (self.action.actionID) json[@"action"] = @{@"type" : @((int)self.action.type), @"id" : self.action.actionID};
    
    return json;
}
@end
