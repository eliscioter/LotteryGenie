import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestUserPermission() {
    const auth_status = await messaging().requestPermission();
    const enabled = 
        auth_status == messaging.AuthorizationStatus.AUTHORIZED ||
        auth_status == messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status: ', auth_status);
        getFcmToken();
    }
}

export async function getFcmToken() {
    try {
        const fcm_token = await messaging().getToken();

        if (fcm_token) {
            console.log('FCM Token: ', fcm_token);
        }
    } catch (error) {
        console.error('Error getting FCM token: ', error);
    }
}

export function setupMessageListeners() {
    const unsubscribe = messaging().onMessage(async remote_message => {
        Alert.alert("A new message arrived!", JSON.stringify(remote_message));
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    return unsubscribe;
}