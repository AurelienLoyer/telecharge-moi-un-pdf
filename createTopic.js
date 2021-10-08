const { PubSub } = require(`@google-cloud/pubsub`);
const { projectId, apiEndpoint, topicName } = require("./configPubsub");

const pubsub = new PubSub({
  apiEndpoint, // Pub/Sub emulator endpoint
  projectId, // Pub/Sub projectId
});

pubsub
  .createTopic(topicName)
  .then(() => {
    console.info(`Topic ${topicName} created. ✅`);
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });
