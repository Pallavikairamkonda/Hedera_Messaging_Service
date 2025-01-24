const { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicMessageQuery } = require("@hashgraph/sdk");
const crypto = require("crypto");

// Hedera client setup
const operatorId = "0.0.5392837"; // Your Hedera Account ID
const operatorKey = "302e020100300506032b657004220420b7f670f619ade197beee9c39e5e3477536f32cad1bed9510a4313d1ccad973f2"; // Your Hedera Private Key

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// Fixed Encryption/Decryption Key for consistent results
const encryptionKey = crypto.createHash('sha256').update(String('fixed_key')).digest('base64').substr(0, 32);

// Utility Functions for Encryption/Decryption
function encryptMessage(message) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encrypted };
}

function decryptMessage(encryptedData) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, Buffer.from(encryptedData.iv, "hex"));
  let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Create a New Topic
async function createTopic() {
  const transaction = await new TopicCreateTransaction().execute(client);
  const receipt = await transaction.getReceipt(client);
  const topicId = receipt.topicId;
  console.log(`Topic created with ID: ${topicId}`);
  return topicId;
}

// Send Message
async function sendMessage(topicId, message) {
  const { iv, encrypted } = encryptMessage(message);
  const encryptedPayload = JSON.stringify({ iv, encrypted });
  
  const transaction = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: encryptedPayload,
  }).execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log(`Message sent: ${message} | Status: ${receipt.status}`);
}

// Subscribe and Retrieve Messages
async function subscribeToTopic(topicId, filterKeyword = null) {
  new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
      const payload = JSON.parse(Buffer.from(message.contents).toString());
      const decryptedMessage = decryptMessage(payload);

      if (!filterKeyword || decryptedMessage.includes(filterKeyword)) {
        console.log(`Received: ${decryptedMessage} | Consensus Timestamp: ${message.consensusTimestamp}`);
      }
    });
}

(async () => {
  // Step 1: Create Topic
  const topicId = await createTopic();

  // Step 2: Send Messages
  await sendMessage(topicId, "Hello, Hedera!");
  await sendMessage(topicId, "Learning HCS");
  await sendMessage(topicId, "Message 3");

  // Step 3: Subscribe to Topic and Filter Messages
  console.log("Subscribing to messages containing 'Hedera':");
  subscribeToTopic(topicId, "Hedera");
  console.log(`Subscribed to topic: ${topicId}`);
})();