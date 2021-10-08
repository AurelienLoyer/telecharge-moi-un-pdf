const timeout = 60;

const {
  projectId,
  apiEndpoint,
  topicName,
  subscriptionName,
} = require("./configPubsub");
const functions = require("./index");

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client;
const pubSubClient = new PubSub({
  apiEndpoint,
  projectId,
});

function listenForMessages() {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = async (message) => {
    const parseData = JSON.parse(message.data);

    console.log(`Received message ${message.id}:`);
    messageCount += 1;

    // console.log(parseData);
    // We call the cloud function / normaly done by GCP
    functions.pdfCloudFunctionOnPubSub(parseData.message);

    // Ack on success 👌
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on("message", messageHandler);

  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
    console.log(`${messageCount} message(s) received.`);
    console.log(`---------------------------------`);
  }, timeout * 1000);
}

listenForMessages();
