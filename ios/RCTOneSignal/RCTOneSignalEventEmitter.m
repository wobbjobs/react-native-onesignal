#import "RCTOneSignalEventEmitter.h"
#if __has_include(<OneSignal/OneSignal.h>)
#import <OneSignal/OneSignal.h>
#else
#import "OneSignal.h"
#endif

#import "RCTOneSignal.h"

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"


@implementation RCTOneSignalEventEmitter {
    BOOL hasListeners;
}

static BOOL _didStartObserving = false;

+ (BOOL)hasSetBridge {
    return _didStartObserving;
}

+(BOOL)requiresMainQueueSetup {
    return YES;
}

/*
     This class acts as the module & event emitter
     It is initialized automatically by React-Native
     This subclass handles communication between the SDK and JavaScript
*/

RCT_EXPORT_MODULE(RCTOneSignal)

#pragma mark RCTEventEmitter Subclass Methods

-(instancetype)init {
    if (self = [super init]) {
        [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:@"Initialized RCTOneSignalEventEmitter"];
        
        for (NSString *eventName in [self supportedEvents])
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(emitEvent:) name:eventName object:nil];
    }
    
    return self;
}

-(void)startObserving {
    hasListeners = true;
    [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:@"RCTOneSignalEventEmitter did start observing"];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:@"didSetBridge" object:nil];
    
    _didStartObserving = true;
}

-(void)stopObserving {
    hasListeners = false;
    [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:@"RCTOneSignalEventEmitter did stop observing"];
}

-(NSArray<NSString *> *)supportedEvents {
    NSMutableArray *events = [NSMutableArray new];
    
    for (int i = 0; i < OSNotificationEventTypesArray.count; i++)
        [events addObject:OSEventString(i)];
    
    return events;
}


#pragma mark Send Event Methods

- (void)emitEvent:(NSNotification *)notification {
    if (!hasListeners) {
        [OneSignal onesignal_Log:ONE_S_LL_WARN message:[NSString stringWithFormat:@"Attempted to send an event (%@) when no listeners were set.", notification.name]];
        return;
    }
    
    [self sendEventWithName:notification.name body:notification.userInfo];
}

+ (void)sendEventWithName:(NSString *)name withBody:(NSDictionary *)body {
    [[NSNotificationCenter defaultCenter] postNotificationName:name object:nil userInfo:body];
}


#pragma mark Exported Methods

RCT_EXPORT_METHOD(log:(int)level withMessage:(NSString *)message) {
    [OneSignal onesignal_Log:(ONE_S_LOG_LEVEL)level message:message];
}

RCT_EXPORT_METHOD(setRequiresUserPrivacyConsent:(BOOL)required) {
    [OneSignal setRequiresUserPrivacyConsent:required];
}

RCT_EXPORT_METHOD(provideUserConsent:(BOOL)granted) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [OneSignal consentGranted:granted];
    });
}

RCT_REMAP_METHOD(userProvidedPrivacyConsent, resolver: (RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@(!OneSignal.requiresUserPrivacyConsent));
}

RCT_EXPORT_METHOD(initWithAppId:(NSString *)appId settings:(NSDictionary *)settings) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RCTOneSignal sharedInstance] configureWithAppId:appId settings:settings];
    });
}

RCT_EXPORT_METHOD(promptForPushNotificationPermissions:(RCTResponseSenderBlock)callback) {
    [OneSignal promptForPushNotificationsWithUserResponse:^(BOOL accepted) {
        callback(@[@(accepted)]);
    }];
}

RCT_EXPORT_METHOD(setEmail :(NSString *)email withAuthHash:(NSString *)authHash withResponse:(RCTResponseSenderBlock)callback) {
    // Auth hash token created on server and sent to client.
    [OneSignal setEmail:email withEmailAuthHashToken:authHash withSuccess:^{
        callback(@[]);
    } withFailure:^(NSError *error) {
        callback(@[error.userInfo[@"error"] ?: error.localizedDescription]);
    }];
}

RCT_EXPORT_METHOD(setUnauthenticatedEmail:(NSString *)email withResponse:(RCTResponseSenderBlock)callback) {
    // Does not use an email auth has token, uses unauthenticated state
    [OneSignal setEmail:email withSuccess:^{
        callback(@[]);
    } withFailure:^(NSError *error) {
        callback(@[error.userInfo[@"error"] ?: error.localizedDescription]);
    }];
}

RCT_EXPORT_METHOD(logoutEmail:(RCTResponseSenderBlock)callback) {
    [OneSignal logoutEmailWithSuccess:^{
        callback(@[]);
    } withFailure:^(NSError *error) {
        callback(@[error.userInfo[@"error"] ?: error.localizedDescription]);
    }];
}

RCT_REMAP_METHOD(getPermissionSubscriptionState, permissionSubscriptionResolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (RCTRunningInAppExtension()) {
        reject(@"onesignal", @"Cannot run getPermissionSubscriptionState() in app extension", nil);
        return;
    }
    
    OSPermissionSubscriptionState *state = [OneSignal getPermissionSubscriptionState];
    
    resolve(@{
              @"subscriptionStatus" : state.subscriptionStatus.toDictionary,
              @"permissionStatus" : state.permissionStatus.toDictionary,
              @"emailSubscriptionStatus" : state.emailSubscriptionStatus.toDictionary
              });
}

RCT_EXPORT_METHOD(setInFocusDisplayType:(int)displayType) {
    [OneSignal setInFocusDisplayType:displayType];
}

RCT_EXPORT_METHOD(promptForPushNotificationsWithUserResponse:(RCTResponseSenderBlock)callback) {
    [OneSignal promptForPushNotificationsWithUserResponse:^(BOOL accepted) {
        [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:@"Prompt For Push Notifications Success"];
        callback(@[@(accepted)]);
    }];
}

RCT_EXPORT_METHOD(sendTag:(NSString *)key value:(NSString*)value) {
    [OneSignal sendTag:key value:value];
}

RCT_EXPORT_METHOD(sendTags:(NSDictionary *)properties withResponse:(RCTResponseSenderBlock)callback) {
    [OneSignal sendTags:properties onSuccess:^(NSDictionary *success) {
        [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:@"Send Tags Success"];
        callback(@[success]);
    } onFailure:^(NSError *error) {
        [OneSignal onesignal_Log:ONE_S_LL_ERROR message:[NSString stringWithFormat:@"Send Tags Failure With Error: %@", error]];
        callback(@[error]);
    }];}

RCT_EXPORT_METHOD(getTags:(RCTResponseSenderBlock)callback) {
    [OneSignal getTags:^(NSDictionary *tags) {
        [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:@"Get Tags Success"];
        callback(@[tags]);
    } onFailure:^(NSError *error) {
        [OneSignal onesignal_Log:ONE_S_LL_VERBOSE message:[NSString stringWithFormat:@"Get Tags Failure with error: %@", error]];
        callback(@[error]);
    }];
}

RCT_EXPORT_METHOD(setLocationShared:(BOOL)shared) {
    [OneSignal setLocationShared:shared];
}

RCT_EXPORT_METHOD(deleteTags:(NSArray *)keys withResponse:(RCTResponseSenderBlock)callback) {
    [OneSignal deleteTags:keys onSuccess:^(NSDictionary *result) {
        callback(@[result]);
    } onFailure:^(NSError *error) {
        callback(@[error]);
    }];
}

RCT_EXPORT_METHOD(setSubscription:(BOOL)enable) {
    [OneSignal setSubscription:enable];
}

RCT_EXPORT_METHOD(promptLocation) {
    [OneSignal promptLocation];
}

// The post notification endpoint accepts four parameters.
RCT_EXPORT_METHOD(postNotification:(NSDictionary *)notification withResponse:(RCTResponseSenderBlock)callback) {
    [OneSignal postNotification:notification onSuccess:^(NSDictionary *result) {
        callback(@[result]);
    } onFailure:^(NSError *error) {
        callback(@[error]);
    }];
}

RCT_EXPORT_METHOD(syncHashedEmail:(NSString*)email) {
    [OneSignal syncHashedEmail:email];
}

RCT_EXPORT_METHOD(setLogLevel:(int)logLevel visualLogLevel:(int)visualLogLevel) {
    [OneSignal setLogLevel:logLevel visualLevel:visualLogLevel];
}

RCT_EXPORT_METHOD(presentAppSettings) {
    [OneSignal presentAppSettings];
}

@end
