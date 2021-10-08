const { projectId, apiEndpoint, topicName } = require("./configPubsub");
const { PubSub } = require("@google-cloud/pubsub");
const fs = require("fs");

const pubsub = new PubSub({
  apiEndpoint,
  projectId,
});

const data = JSON.parse(fs.readFileSync("mockPubsub.json"));

const dataBuffer = Buffer.from(JSON.stringify(data));

const publisher = pubsub.topic(topicName).publisher;

pubsub.topic(topicName).subs;
publisher
  .publish(dataBuffer)
  .then((messageId) => {
    console.log(`Message ${messageId} published 🛫`);
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });
