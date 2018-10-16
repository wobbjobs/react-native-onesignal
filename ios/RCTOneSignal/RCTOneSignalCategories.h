
#if __has_include(<OneSignal/OneSignal.h>)
#import <OneSignal/OneSignal.h>
#else
#import "OneSignal.h"
#endif

NS_ASSUME_NONNULL_BEGIN

@interface OSNotificationPayload (Flutter)
- (NSDictionary *)toJson;
@end

@interface OSNotification (Flutter)
- (NSDictionary *)toJson;
@end

@interface OSNotificationOpenedResult (Flutter)
- (NSDictionary *)toJson;
@end

NS_ASSUME_NONNULL_END
