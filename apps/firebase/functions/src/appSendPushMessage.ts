import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {REGION} from "./lib/constants";

export const pushDemo = functions.region(REGION).https.onCall(async (data, _response) => {
  const token = data.token;

  const message = {
    notification: {
      title: "Notification Title",
      body: "Notification Body",
    },
    data: {
      title: "Data Title",
      body: "Data Body",
    }
  };
  pushToDevice(token, message);
});

export const pushToDevice = (deviceToken: string, message: {
  notification: {
    title: string,
    body: string,
  },
  data: {
    title: string,
    body: string,
  }
}) => {
  admin.messaging().send({
    notification: {
      title: message.notification.title,
      body: message.notification.body,
    },
    data: {
      title: message.data.title,
      body: message.data.body,
    },
    android: {
      notification: {
        sound: "default",
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
      },
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: "default",
        },
      },
    },
    token: deviceToken,
  })
      .then((response) => {
        return {
          text: deviceToken,
        };
      })
      .catch((e) => {
        throw new Error(e);
      });
};
