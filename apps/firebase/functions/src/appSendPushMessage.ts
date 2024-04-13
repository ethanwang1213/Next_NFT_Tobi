import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {REGION} from "./lib/constants";

export const pushDemo = functions.region(REGION).https.onRequest(async (req, response) => {
  const token = req.query.token as string;

  pushToDevice(token, {
    title: "Notification Title",
    body: "Notification Body",
  },
  {
    body: "{ \"type\": \"mintCompleted\", \"data\": { \"id\": 0 } }",
  });

  response.status(200).send("submit").end();
});

export const pushToDevice = (deviceToken: string, notification?: { title: string, body: string, }, data?: { body: string, }) => {
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
  if (notification) {
    body.notification = {
      title: notification.title,
      body: notification.body,
    };
  }
  if (data) {
    body.data = {
      body: data.body,
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
