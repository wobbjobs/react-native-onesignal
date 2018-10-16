#if __has_include(<React/RCTConvert.h>)
#import <React/RCTConvert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#else
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"
#endif

#import "RCTOneSignal.h"
#import "RCTOneSignalEventEmitter.h"
#import "RCTOneSignalCategories.h"

#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_8_0

#define UIUserNotificationTypeAlert UIRemoteNotificationTypeAlert
#define UIUserNotificationTypeBadge UIRemoteNotificationTypeBadge
#define UIUserNotificationTypeSound UIRemoteNotificationTypeSound
#define UIUserNotificationTypeNone  UIRemoteNotificationTypeNone
#define UIUserNotificationType      UIRemoteNotificationType

#endif

@interface RCTOneSignal ()
@end

@implementation RCTOneSignal {
    BOOL didInitialize;
}

OSNotificationOpenedResult* coldStartOSNotificationOpenedResult;

+ (RCTOneSignal *) sharedInstance {
    static dispatch_once_t token = 0;
    static id _sharedInstance = nil;
    dispatch_once(&token, ^{
        _sharedInstance = [[RCTOneSignal alloc] init];
    });
    return _sharedInstance;
}

- (void)initOneSignal {
    [OneSignal setValue:@"react" forKey:@"mSDKType"];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didBeginObserving) name:@"didSetBridge" object:nil];
    
    [OneSignal initWithLaunchOptions:nil appId:nil handleNotificationReceived:^(OSNotification* notification) {
        [self handleRemoteNotificationReceived:notification];
    } handleNotificationAction:^(OSNotificationOpenedResult *result) {
        if (!RCTOneSignal.sharedInstance.didStartObserving)
            coldStartOSNotificationOpenedResult = result;
        else
            [self handleRemoteNotificationOpened:result];
        
    } settings:@{@"kOSSettingsKeyInOmitNoAppIdLogging" : @true, kOSSettingsKeyAutoPrompt : @false}]; //default autoPrompt to false since init will be called again
    didInitialize = false;
}

// deprecated init methods
// provides backwards compatibility
- (id)initWithLaunchOptions:(NSDictionary *)launchOptions appId:(NSString *)appId {
    return [self initWithLaunchOptions:launchOptions appId:appId settings:nil];
}

- (id)initWithLaunchOptions:(NSDictionary *)launchOptions appId:(NSString *)appId settings:(NSDictionary*)settings {
    [self configureWithAppId:appId settings:settings];
    
    return self;
}

- (void)didBeginObserving {
    // To continue supporting deprecated initialization methods (which create a new RCTOneSignal instance),
    // we will only access the didStartObserving property of the shared instance to avoid issues
    RCTOneSignal.sharedInstance.didStartObserving = true;
    
    dispatch_async(dispatch_get_main_queue(), ^{
        if (coldStartOSNotificationOpenedResult) {
            [self handleRemoteNotificationOpened:coldStartOSNotificationOpenedResult];
            coldStartOSNotificationOpenedResult = nil;
        }
    });
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)configureWithAppId:(NSString *)appId {
    [self configureWithAppId:appId settings:nil];
}

- (void)configureWithAppId:(NSString *)appId settings:(NSDictionary*)settings {
    
    if (didInitialize)
        return;
    
    didInitialize = true;
    [OneSignal addSubscriptionObserver:self];
    [OneSignal addEmailSubscriptionObserver:self];
    [OneSignal addPermissionObserver:self];
    [OneSignal initWithLaunchOptions:nil
                               appId:appId
          handleNotificationReceived:^(OSNotification* notification) {
              [self handleRemoteNotificationReceived:notification];
          }
          handleNotificationAction:^(OSNotificationOpenedResult *result) {
              if (!RCTOneSignal.sharedInstance.didStartObserving)
                  coldStartOSNotificationOpenedResult = result;
              else
                  [self handleRemoteNotificationOpened:result];
              
          }
          settings:settings];
}

/**
    Event observers - lets the native SDK send observer/events to JS
*/
-(void)onOSEmailSubscriptionChanged:(OSEmailSubscriptionStateChanges *)stateChanges {
    [self sendEvent:OSEventString(EmailSubscriptionChanged) withBody:stateChanges.toDictionary];
}

- (void)onOSSubscriptionChanged:(OSSubscriptionStateChanges*)stateChanges {
    [self sendEvent:OSEventString(SubscriptionChanged) withBody:stateChanges.toDictionary];
}

- (void)onOSPermissionChanged:(OSPermissionStateChanges *)stateChanges {
    [self sendEvent:OSEventString(PermissionChanged) withBody:stateChanges.toDictionary];
}

- (void)handleRemoteNotificationReceived:(OSNotification *)notification {
    [self sendEvent:OSEventString(NotificationReceived) withBody:notification.toJson];
}

- (void)handleRemoteNotificationOpened:(OSNotificationOpenedResult *)result {
    [self sendEvent:OSEventString(NotificationOpened) withBody:result.toJson];
}

- (void)sendEvent:(NSString *)eventName withBody:(NSDictionary *)body {
    [RCTOneSignalEventEmitter sendEventWithName:eventName withBody:body];
}

@end
