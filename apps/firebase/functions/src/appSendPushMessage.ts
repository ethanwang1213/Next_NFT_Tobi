import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {REGION} from "./lib/constants";

admin.initializeApp();

const pushDemo = functions.region(REGION).https.onCall(async (data, _response) => {
    const token = data.token;

    const message = {
        notification: {
            title: "Notification Title",
            body: "Notification Body"
        },
        data: {
            title: "Data Title",
            body: "Data Body"
        },
        android: {
            notification: {
                sound: 'default',
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
        },
        apns: {
            payload: {
                aps: {
                    badge: 1,
                    sound: 'default'
                },
            },
        },
        token: token
    };
    pushToDevice(token, message);
});

export const pushToDevice = (deviceToken: string, payload: any) => {
    admin.messaging().send(payload)
        .then((response) => {
            return {
                text: deviceToken
            };
        })
        .catch(e => {
            throw new Error(e);
        });
}