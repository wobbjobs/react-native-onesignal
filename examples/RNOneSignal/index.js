"use strict";
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_onesignal_1 = require("react-native-onesignal");
const notification_1 = require("react-native-onesignal/notification");
let imageUri = 'https://cdn-images-1.medium.com/max/300/1*7xHdCFeYfD8zrIivMiQcCQ.png';
class RNOneSignal extends react_1.default.Component {
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            react_native_onesignal_1.OneSignal.shared.setLogLevel(react_native_onesignal_1.OSLogLevel.verbose, react_native_onesignal_1.OSLogLevel.none);
            let requiresConsent = false;
            this.setState({ emailEnabled: false,
                animatingEmailButton: false,
                initialOpenFromPush: "Did NOT open from push",
                activityWidth: 0,
                width: 0,
                activityMargin: 0,
                buttonColor: react_native_1.Platform.OS == "ios" ? "#ffffff" : "#d45653",
                jsonDebugText: "",
                privacyButtonTitle: "Privacy Consent: Not Granted",
                requirePrivacyConsent: requiresConsent
            });
            react_native_onesignal_1.OneSignal.shared.setRequiresUserPrivacyConsent(requiresConsent);
            react_native_onesignal_1.OneSignal.shared.init("76391b0a-8c97-4053-8cd6-bac5d1938853", { kOSSettingsKeyAutoPrompt: true });
            var providedConsent = yield react_native_onesignal_1.OneSignal.shared.userProvidedPrivacyConsent();
            this.setState({ privacyButtonTitle: `Privacy Consent: ${providedConsent ? "Granted" : "Not Granted"}`, privacyGranted: providedConsent });
            react_native_onesignal_1.OneSignal.shared.setLocationShared(true);
            react_native_onesignal_1.OneSignal.shared.setInFocusDisplayType(react_native_onesignal_1.OSNotificationDisplayType.notification);
        });
    }
    componentDidMount() {
        this.onReceived = this.onReceived.bind(this);
        this.onOpened = this.onOpened.bind(this);
        this.subscriptionChanged = this.subscriptionChanged.bind(this);
        this.permissionChanged = this.permissionChanged.bind(this);
        this.onEmailRegistrationChange = this.onEmailRegistrationChange.bind(this);
        react_native_onesignal_1.OneSignal.shared.addNotificationOpenedObserver(this.onOpened);
        react_native_onesignal_1.OneSignal.shared.addNotificationReceivedObserver(this.onReceived);
        react_native_onesignal_1.OneSignal.shared.addSubscriptionObserver(this.subscriptionChanged);
        react_native_onesignal_1.OneSignal.shared.addPermissionObserver(this.permissionChanged);
        react_native_onesignal_1.OneSignal.shared.addEmailSubscriptionObserver(this.onEmailRegistrationChange);
    }
    componentWillUnmount() {
        react_native_onesignal_1.OneSignal.shared.clearObservers();
    }
    onEmailRegistrationChange(registration) {
        console.log("onEmailRegistrationChange: ", registration);
    }
    onReceived(notification) {
        console.log("Notification received: ", notification);
        this.setState({ jsonDebugText: "RECEIVED: \n" + JSON.stringify(notification, null, 2) });
    }
    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        this.setState({ jsonDebugText: "OPENED: \n" + JSON.stringify(openResult.notification, null, 2) });
    }
    subscriptionChanged(device) {
        console.log('Device info: ', device);
    }
    permissionChanged(changes) {
    }
    postNotification() {
        react_native_onesignal_1.OneSignal.shared.getPermissionSubscriptionState(state => {
            let userId = state.userId;
            if (!userId)
                return;
            let notification = new notification_1.OSCreateNotification("76391b0a-8c97-4053-8cd6-bac5d1938853");
            notification.playerIds = [userId];
            notification.content = "Test Notification Body";
            notification.heading = "Test Notification Title";
            react_native_onesignal_1.OneSignal.shared.postNotification(notification, (result) => {
            });
        });
    }
    render() {
        return (react_1.default.createElement(react_native_1.ScrollView, { style: styles.scrollView },
            react_1.default.createElement(react_native_1.View, { style: styles.container },
                react_1.default.createElement(react_native_1.View, null,
                    react_1.default.createElement(react_native_1.Image, { style: styles.imageStyle, source: { uri: imageUri } })),
                react_1.default.createElement(react_native_1.Text, { style: styles.welcome }, "Welcome to React Native!"),
                react_1.default.createElement(react_native_1.Text, { style: styles.instructions }, "To get started, edit index.js"),
                react_1.default.createElement(react_native_1.Text, { style: styles.instructions },
                    "Double tap R on your keyboard to reload,",
                    '\n',
                    "Shake or press menu button for dev menu"),
                react_1.default.createElement(react_native_1.View, { style: { flexDirection: 'row', overflow: 'hidden' } },
                    react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                        react_1.default.createElement(react_native_1.Button, { style: styles.button, onPress: () => {
                                react_native_onesignal_1.OneSignal.shared.getTags((tags) => {
                                    console.log("Did get tags: ", tags);
                                    this.setState({ jsonDebugText: JSON.stringify(tags, null, 2) });
                                });
                            }, title: "Get Tags", color: this.state.buttonColor })),
                    react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                        react_1.default.createElement(react_native_1.Button, { style: styles.button, onPress: () => {
                                console.log("Sending tags");
                                react_native_onesignal_1.OneSignal.shared.sendTags({ "test_property_1": "test_value_1", "test_property_2": "test_value_2" });
                            }, title: "Send Tags", color: this.state.buttonColor }))),
                react_1.default.createElement(react_native_1.View, { style: { flexDirection: 'row', overflow: 'hidden' } },
                    react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                        react_1.default.createElement(react_native_1.Button, { style: styles.button, disabled: !this.state.emailEnabled, onPress: () => {
                                this.setState({ animatingEmailButton: true, activityWidth: 20, activityMargin: 10 });
                                react_native_onesignal_1.OneSignal.shared.setEmail(this.state.email, (error) => {
                                    console.log("Sent email with error: ", error);
                                    this.setState({ animatingEmailButton: false, activityWidth: 0, activityMargin: 0 });
                                });
                            }, title: "Set Test Email", color: this.state.buttonColor })),
                    react_1.default.createElement(react_native_1.ActivityIndicator, { style: { width: this.state.activityWidth, marginLeft: this.state.activityMargin }, animating: this.state.animatingEmailButton }),
                    react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                        react_1.default.createElement(react_native_1.Button, { style: styles.button, onPress: () => {
                                react_native_onesignal_1.OneSignal.shared.logoutEmail((error) => {
                                    if (error) {
                                        console.log("Encountered error while attempting to log out: ", error);
                                    }
                                    else {
                                        console.log("Logged out successfully");
                                    }
                                });
                            }, title: "Logout Email", color: this.state.buttonColor }))),
                react_1.default.createElement(react_native_1.KeyboardAvoidingView, { style: { width: 300, height: 40, borderColor: '#d45653', borderWidth: 2, borderRadius: 5, marginTop: 8 } },
                    react_1.default.createElement(react_native_1.TextInput, { style: styles.textInput, underlineColorAndroid: 'rgba(0, 0, 0, 0)', placeholderText: 'testing', placeholder: 'test@email.com', multiline: false, keyboardType: 'email-address', returnKeyType: 'done', textAlign: 'center', placeholderTextColor: '#d1dde3', editable: true, autoCapitalize: 'none', keyboardAppearance: 'dark', onChangeText: (newText) => {
                            this.setState({ emailEnabled: this.validateEmail(newText), email: newText });
                        } })),
                react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                    react_1.default.createElement(react_native_1.Button, { style: styles.button, onPress: () => {
                            react_native_onesignal_1.OneSignal.shared.promptLocation();
                        }, title: "Prompt Location", color: this.state.buttonColor })),
                react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                    react_1.default.createElement(react_native_1.Button, { style: styles.button, onPress: () => {
                            react_native_onesignal_1.OneSignal.shared.getPermissionSubscriptionState((subscriptionState) => {
                                this.setState({ jsonDebugText: JSON.stringify(subscriptionState, null, 2) });
                            });
                        }, title: "Print Subscription State", color: this.state.buttonColor })),
                react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                    react_1.default.createElement(react_native_1.Button, { style: styles.button, onPress: () => {
                            var userId = react_native_onesignal_1.OneSignal.shared.getPermissionSubscriptionState((subscriptionState) => {
                                if (subscriptionState.userId == null) {
                                    return;
                                }
                                this.postNotification();
                                this.setState({ jsonDebugLabelText: "Posting Notification" });
                            });
                        }, title: "Post Notification", color: this.state.buttonColor })),
                react_1.default.createElement(react_native_1.View, { style: styles.buttonContainer },
                    react_1.default.createElement(react_native_1.Button, { style: styles.button, disabled: !this.state.requirePrivacyConsent, onPress: () => {
                            this.setState({ privacyGranted: !this.state.privacyGranted, privacyButtonTitle: `Privacy State: ${!this.state.privacyGranted ? "Granted" : "Not Granted"}` });
                            react_native_onesignal_1.OneSignal.shared.provideUserConsent(!this.state.privacyGranted);
                        }, title: this.state.privacyButtonTitle, color: this.state.buttonColor })),
                react_1.default.createElement(react_native_1.Text, { style: styles.jsonDebugLabelText }, this.state.jsonDebugText))));
    }
}
exports.default = RNOneSignal;
const styles = react_native_1.StyleSheet.create({
    scrollView: {
        backgroundColor: '#F5FCFF'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        marginHorizontal: 10
    },
    jsonDebugLabelText: {
        textAlign: 'left',
        color: '#333333',
        marginBottom: 5,
        marginHorizontal: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#d45653"
    },
    button: {
        color: '#000000',
        flex: 1
    },
    imageStyle: {
        height: 200,
        width: 200,
        marginTop: 20
    },
    textInput: {
        marginHorizontal: 10,
        height: 40
    }
});
react_native_1.AppRegistry.registerComponent('RNOneSignal', () => RNOneSignal);
