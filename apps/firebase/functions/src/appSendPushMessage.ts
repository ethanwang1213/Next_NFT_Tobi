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
  notification?: {
    title: string,
    body: string,
  },
  data?: {
    body: string,
  }
}) => {
  const body: any = {
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
  };
  if (message.notification) {
    body.notification = {
      title: message.notification.title,
      body: message.notification.body,
    };
  }
  if (message.data) {
    body.data = {
      body: message.data.body,
    };
  }

  admin.messaging().send(body)
      .then((response) => {
        return {
          text: deviceToken,
        };
      })
      .catch((e) => {
        throw new Error(e);
      });
};
