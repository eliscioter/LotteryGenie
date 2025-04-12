import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import {scheduleNotificationAsync, setNotificationHandler } from "expo-notifications";


setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowAlert: true
    })
})

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
            return {
                fcm_token,
                correlation_token: generateCorrelationToken(),
            };
        }
    } catch (error) {
        console.error('Error getting FCM token: ', error);
    }
}

export function setupMessageListeners() {
    const unsubscribe = messaging().onMessage(async (remote_message: FirebaseMessagingTypes.RemoteMessage) => {
        if (remote_message.notification) {
            await scheduleNotificationAsync({
                content: {
                    title: remote_message.notification.title || "New Message",
                    body: remote_message.notification.body?.replaceAll('"', '') || JSON.stringify(remote_message)
                },
                trigger: null
            })
          } else {
            Alert.alert("Lotto Genie", JSON.stringify(remote_message));
          }
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

function generateCorrelationToken() {
    return uuidv4();

}