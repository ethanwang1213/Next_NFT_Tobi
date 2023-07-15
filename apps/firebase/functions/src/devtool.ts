import * as functions from "firebase-functions";
import {PubSub} from "@google-cloud/pubsub";
import {REGION} from "./lib/constants";

export const pubsubHelper = functions.region(REGION).https.onRequest(async (request, response) => {
  console.log("pubsubHelper");
  // 1. make sure the function can't be used in production
  if (!process.env.PUBSUB_EMULATOR_HOST) {
    functions.logger
        .error("This function should only run locally in an emulator.");
    response.status(400).end();
  }

  const topicName = request.body.topicName;

  const pubsub = new PubSub();

  // 2. make sure the test topic exists and
  // if it doesn't then create it.
  const [topics] = await pubsub.getTopics();

  // topic.name is of format 'projects/PROJECT_ID/topics/test-topic',
  const testTopic = topics.filter(
      (topic) => topic.name.includes(topicName)
  )?.[0];
  if (!testTopic) await pubsub.createTopic(topicName);

  // 3. publish to test topic and get message ID
  const messageID = await pubsub.topic(topicName).publishMessage({
    json: request.body,
  });

  // 4. send back a helpful message
  response.status(201).send(
      {success: `Published to pubsub ${topicName} -- message ID: `, messageID}
  );
});
