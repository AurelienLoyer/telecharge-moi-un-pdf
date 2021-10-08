const {
  projectId,
  apiEndpoint,
  topicName,
  subscriptionName,
} = require("./configPubsub");

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creation of the pubsub client
const pubSubClient = new PubSub({
  apiEndpoint,
  projectId,
});

// Creates a new subscription
async function createSubscription() {
  await pubSubClient.topic(topicName).createSubscription(subscriptionName);
  console.log(`Subscription ${subscriptionName} created. ✅`);
}

createSubscription().catch(console.error);
