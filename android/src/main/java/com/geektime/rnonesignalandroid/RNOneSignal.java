package com.geektime.rnonesignalandroid;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Promise;
import com.onesignal.OSEmailSubscriptionStateChanges;
import com.onesignal.OSNotification;
import com.onesignal.OSPermissionState;
import com.onesignal.OSPermissionStateChanges;
import com.onesignal.OSPermissionSubscriptionState;
import com.onesignal.OSSubscriptionState;
import com.onesignal.OSEmailSubscriptionState;
import com.onesignal.OSSubscriptionObserver;
import com.onesignal.OSEmailSubscriptionObserver;
import com.onesignal.OSPermissionObserver;
import com.onesignal.OSNotificationOpenResult;
import com.onesignal.OSSubscriptionStateChanges;
import com.onesignal.OneSignal;
import com.onesignal.OneSignal.EmailUpdateHandler;
import com.onesignal.OneSignal.EmailUpdateError;
import com.onesignal.OneSignal.NotificationOpenedHandler;
import com.onesignal.OneSignal.NotificationReceivedHandler;
import com.onesignal.OneSignal.LOG_LEVEL;
import com.onesignal.OneSignal.ChangeTagsUpdateHandler;
import com.onesignal.OneSignal.SendTagsError;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;


/**
* Created by Avishay on 1/31/16.
*/
public class RNOneSignal extends ReactContextBaseJavaModule implements LifecycleEventListener, NotificationReceivedHandler, NotificationOpenedHandler, OSSubscriptionObserver, OSEmailSubscriptionObserver, OSPermissionObserver {
   public static final String NOTIFICATION_OPENED_INTENT_FILTER = "GTNotificationOpened";
   public static final String NOTIFICATION_RECEIVED_INTENT_FILTER = "GTNotificationReceived";
   public static final String HIDDEN_MESSAGE_KEY = "hidden";

   private ReactApplicationContext mReactApplicationContext;
   private ReactContext mReactContext;
   private boolean oneSignalInitDone;
   private boolean registeredEvents = false;

   private OSNotificationOpenResult coldStartNotificationResult;
   private boolean setNotificationOpenedHandler = false;
   private boolean didSetRequiresPrivacyConsent = false;
   private boolean waitingForUserPrivacyConsent = false;

   //ensure only one callback exists at a given time due to react-native restriction
   private Callback pendingGetTagsCallback;

   public RNOneSignal(ReactApplicationContext reactContext) {
      super(reactContext);
      mReactApplicationContext = reactContext;
      mReactContext = reactContext;
      mReactContext.addLifecycleEventListener(this);
      initOneSignal();
   }

   private String appIdFromManifest(ReactApplicationContext context) {
      try {
         ApplicationInfo ai = context.getPackageManager().getApplicationInfo(context.getPackageName(), context.getPackageManager().GET_META_DATA);
         Bundle bundle = ai.metaData;
         return bundle.getString("onesignal_app_id");
      } catch (Throwable t) {
         t.printStackTrace();
         return null;
      }
   }

   // Initialize OneSignal only once when an Activity is available.
   // React creates an instance of this class to late for OneSignal to get the current Activity
   // based on registerActivityLifecycleCallbacks it uses to listen for the first Activity.
   // However it seems it is also to soon to call getCurrentActivity() from the reactContext as well.
   // This will normally succeed when onHostResume fires instead.
   private void initOneSignal() {
      // Uncomment to debug init issues.
      // OneSignal.setLogLevel(LOG_LEVEL.VERBOSE, LOG_LEVEL.ERROR);

      OneSignal.sdkType = "react";

      String appId = appIdFromManifest(mReactApplicationContext);

      if (appId != null && appId.length() > 0)
         this.init(appId);
   }

   private void sendEvent(String eventName, Object params) {
      mReactContext
               .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
               .emit(eventName, params);
   }

   private JSONObject jsonFromErrorMessageString(String errorMessage) throws JSONException {
      return new JSONObject().put("error", errorMessage);
   }

  private void addObservers() {
      OneSignal.addSubscriptionObserver(this);
      OneSignal.addEmailSubscriptionObserver(this);
      OneSignal.addPermissionObserver(this);
  }

  private LOG_LEVEL getLogLevel(int level) {
      switch(level) {
         case 0:
            return LOG_LEVEL.NONE;
         case 1:
            return LOG_LEVEL.FATAL;
         case 2:
            return LOG_LEVEL.ERROR;
         case 3:
               return LOG_LEVEL.WARN;
         case 4:
               return LOG_LEVEL.INFO;
         case 5:
               return LOG_LEVEL.DEBUG;
         case 6:
               return LOG_LEVEL.VERBOSE;
      }

      if (level < 0)
         return LOG_LEVEL.NONE;
      return LOG_LEVEL.VERBOSE;
   }

   @ReactMethod 
   public void init(String appId) {
      Context context = mReactApplicationContext.getCurrentActivity();

      if (oneSignalInitDone) {
         Log.e("onesignal", "Already initialized the OneSignal React-Native SDK");
         return;
      }

      oneSignalInitDone = true;

      OneSignal.sdkType = "react";
      
      if (context == null) {
         // in some cases, especially when react-native-navigation is installed,
         // the activity can be null, so we can initialize with the context instead
         context = mReactApplicationContext.getApplicationContext();
      }

      OneSignal.init(context, null, appId, this, this);

      if (this.didSetRequiresPrivacyConsent)
         this.waitingForUserPrivacyConsent = true;
      else
         this.addObservers();
   }

   @ReactMethod
   public void sendTags(ReadableMap tags, final Callback callback) {
       Log.d("onesignal", "SENDING TAGS: " + tags.toString());
      OneSignal.sendTags(RNUtils.readableMapToJson(tags), new ChangeTagsUpdateHandler() {
          boolean called = false;

          @Override
          public void onSuccess(JSONObject tags) {
            if (callback != null && called == false) {
                called = true;
               callback.invoke(RNUtils.jsonToWritableMap(tags));
            }
          }

          @Override
          public void onFailure(SendTagsError error) {
              try {
                  if (callback != null && called == false) {
                      called = true;
                      callback.invoke(RNUtils.jsonToWritableMap(jsonFromErrorMessageString(error.getMessage())));
                  }
              } catch (JSONException exception) {
                  exception.printStackTrace();
              }
          }
      });
   }

   @ReactMethod
   public void getTags(final Callback callback) {
      if (pendingGetTagsCallback == null) 
         pendingGetTagsCallback = callback;
      
      OneSignal.getTags(new OneSignal.GetTagsHandler() {
         @Override
         public void tagsAvailable(JSONObject tags) {
               if (pendingGetTagsCallback != null) 
                  pendingGetTagsCallback.invoke(RNUtils.jsonToWritableMap(tags));

               pendingGetTagsCallback = null;
         }
      });
   }

   @ReactMethod 
   public void setUnauthenticatedEmail(String email, final Callback callback) {
      OneSignal.setEmail(email, null, new OneSignal.EmailUpdateHandler() {
         @Override
         public void onSuccess() {
               callback.invoke();
         }

         @Override
         public void onFailure(EmailUpdateError error) {
               try {
                  callback.invoke(RNUtils.jsonToWritableMap(jsonFromErrorMessageString(error.getMessage())));
               } catch (JSONException exception) {
                  exception.printStackTrace();
               }
         }
      });
   }

   @ReactMethod 
   public void setEmail(String email, String emailAuthToken, final Callback callback) {
      OneSignal.setEmail(email, emailAuthToken, new EmailUpdateHandler() {
         @Override
         public void onSuccess() {
               callback.invoke();
         }

         @Override
         public void onFailure(EmailUpdateError error) {
               try {
                  callback.invoke(RNUtils.jsonToWritableMap(jsonFromErrorMessageString(error.getMessage())));
               } catch (JSONException exception) {
                  exception.printStackTrace();
               }
         }
      });
   }

   @ReactMethod
   public void logoutEmail(final Callback callback) {
      OneSignal.logoutEmail(new EmailUpdateHandler() {
         @Override
         public void onSuccess() {
               callback.invoke();
         }

         @Override
         public void onFailure(EmailUpdateError error) {
               try {
                  callback.invoke(RNUtils.jsonToWritableMap(jsonFromErrorMessageString(error.getMessage())));
               } catch (JSONException exception) {
                  exception.printStackTrace();
               }
         }
      });
   }

   @ReactMethod
   public void getPermissionSubscriptionState(final Callback callback) {
      OSPermissionSubscriptionState state = OneSignal.getPermissionSubscriptionState();

      if (state == null)
         return;

      callback.invoke(OneSignalSerializer.convertPermissionSubscriptionStateToMap(state));
   }

   @ReactMethod
   public void setInFocusDisplayType(int displayOption) {
      OneSignal.setInFocusDisplaying(displayOption);
   }

   @ReactMethod
   public void deleteTag(String key) {
      OneSignal.deleteTag(key);
   }

   @ReactMethod
   public void enableVibrate(Boolean enable) {
      OneSignal.enableVibrate(enable);
   }

   @ReactMethod
   public void enableSound(Boolean enable) {
      OneSignal.enableSound(enable);
   }

   @ReactMethod
   public void setSubscription(Boolean enable) {
      OneSignal.setSubscription(enable);
   }

   @ReactMethod
   public void promptLocation() {
      OneSignal.promptLocation();
   }

   @ReactMethod
   public void syncHashedEmail(String email) {
      OneSignal.syncHashedEmail(email);
   }

   @ReactMethod
   public void setLogLevel(int logLevel, int visualLogLevel) {
      OneSignal.setLogLevel(logLevel, visualLogLevel);
   }

   @ReactMethod
   public void setLocationShared(Boolean shared) {
      OneSignal.setLocationShared(shared);
   }

   @ReactMethod
   public void postNotification(ReadableMap notification, final Callback callback) {
      JSONObject notificationJson = RNUtils.readableMapToJson(notification);

      OneSignal.postNotification(
            notificationJson,
            new OneSignal.PostNotificationResponseHandler() {
               @Override
               public void onSuccess(JSONObject response) {
                  try {
                      if (callback != null) {
                          callback.invoke(OneSignalSerializer.convertJSONObjectToHashMap(response));
                      }
                  } catch (JSONException e) {
                      Log.e("onesignal", "Encountered an error attempting to convert PostNotification response to hashmap");
                  }
               }

               @Override
               public void onFailure(JSONObject response) {
                  if (callback != null) {
                     callback.invoke(RNUtils.jsonToWritableMap(response));
                  }
               }
            }
      );
   }

   @ReactMethod
   public void clearOneSignalNotifications() {
      OneSignal.clearOneSignalNotifications();
   }

   @ReactMethod
   public void cancelNotification(int id) {
      OneSignal.cancelNotification(id);
   }

   @ReactMethod
   public void setRequiresUserPrivacyConsent(Boolean required) {
      OneSignal.setRequiresUserPrivacyConsent(required);
      this.didSetRequiresPrivacyConsent = required;
   }

   @ReactMethod 
   public void provideUserConsent(Boolean granted) {
      OneSignal.provideUserConsent(granted);

      if (this.waitingForUserPrivacyConsent) {
         this.waitingForUserPrivacyConsent = false;

         this.addObservers();
      }
   }

   @ReactMethod
   public void userProvidedPrivacyConsent(Promise promise) {
      promise.resolve(OneSignal.userProvidedPrivacyConsent());
   }

   @ReactMethod
   public void log(int level, String message) {
       OneSignal.onesignalLog(getLogLevel(level), message);
   }

   @Override
   public String getName() {
      return "OneSignal";
   }

   @Override
   public void onHostDestroy() {
      OneSignal.removeNotificationOpenedHandler();
      OneSignal.removeNotificationReceivedHandler();
   }

   @Override
   public void onHostPause() {

   }

   @Override
   public void onHostResume() {
      initOneSignal();
   }

  @ReactMethod 
  public void didSetNotificationOpenedHandler() {
    this.setNotificationOpenedHandler = true;
    if (this.coldStartNotificationResult != null) {
      this.notificationOpened(this.coldStartNotificationResult);
      this.coldStartNotificationResult = null;
    }
  }

  @Override
  public void onOSSubscriptionChanged(OSSubscriptionStateChanges stateChanges) {
     this.sendEvent("OneSignal#subscription", OneSignalSerializer.convertSubscriptionStateChangesToMap(stateChanges));
  }

  @Override
  public void onOSEmailSubscriptionChanged(OSEmailSubscriptionStateChanges stateChanges) {
     this.sendEvent("OneSignal#emailSubscription", OneSignalSerializer.convertEmailSubscriptionStateChangesToMap(stateChanges));
  }

  @Override
  public void onOSPermissionChanged(OSPermissionStateChanges stateChanges) {
     this.sendEvent("OneSignal#permission", OneSignalSerializer.convertPermissionStateChangesToMap(stateChanges));
  }

  @Override
  public void notificationReceived(OSNotification notification) {
    try {
       this.sendEvent("OneSignal#received", OneSignalSerializer.convertNotificationToMap(notification));
    } catch (JSONException exception) {
      Log.e("onesignal", "Encountered an error attempting to convert OSNotification object to hash map: " + exception.getMessage() + "\n" + exception.getStackTrace());
    }
  }

  @Override
  public void notificationOpened(OSNotificationOpenResult result) {
    if (!this.setNotificationOpenedHandler) {
      this.coldStartNotificationResult = result;
      return;
    }
    
    try {
       this.sendEvent("OneSignal#opened", OneSignalSerializer.convertNotificationOpenResultToMap(result));
    } catch (JSONException exception) {
      Log.e("onesignal", "Encountered an error attempting to convert OSNotificationOpenResult object to hash map: " + exception.getMessage() + "\n" + exception.getStackTrace());
    }
  }
}
