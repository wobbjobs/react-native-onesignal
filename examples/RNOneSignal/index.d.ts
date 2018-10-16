/// <reference types="react" />
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
export default class RNOneSignal extends React.Component {
    validateEmail(email: String): Boolean;
    componentWillMount(): Promise<void>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onEmailRegistrationChange(registration: any): void;
    onReceived(notification: any): void;
    onOpened(openResult: any): void;
    subscriptionChanged(device: any): void;
    permissionChanged(changes: any): void;
    postNotification(): void;
    render(): JSX.Element;
}
