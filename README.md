# Hedera Hashgraph Topic Communication

This project demonstrates how to use the Hedera Hashgraph Consensus Service (HCS) to create topics, send encrypted messages, and subscribe to topics while filtering messages based on keywords. The project uses Node.js and the Hedera JavaScript SDK.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or later) - [Download Node.js](https://nodejs.org/)
2. **Hedera JavaScript SDK** - Install via npm.
3. A Hedera Testnet account - You can create one at [Hedera Portal](https://portal.hedera.com/).

## Setup

1. Clone this repository or copy the code.
2. Install dependencies:

   ```bash
   npm install @hashgraph/sdk crypto
   ```
3. Replace the following placeholders in the code with your Hedera Testnet credentials:
   - `operatorId`: Your Hedera Testnet Account ID.
   - `operatorKey`: Your Hedera Testnet Private Key.

## Usage

### Step 1: Create a Topic

The script begins by creating a new topic on the Hedera network. The topic ID is logged to the console.

```javascript
const topicId = await createTopic();
console.log(`Topic created with ID: ${topicId}`);
```

### Step 2: Send Encrypted Messages

Messages are encrypted using AES-256-CBC before being submitted to the topic. You can customize the message content:

```javascript
await sendMessage(topicId, "Hello, Hedera!");
await sendMessage(topicId, "Learning HCS");
await sendMessage(topicId, "Message 3");
```

### Step 3: Subscribe to the Topic and Filter Messages

The script subscribes to the topic and decrypts messages in real-time. You can optionally filter messages by a keyword:

```javascript
subscribeToTopic(topicId, "Hedera");
```

Messages containing the keyword "Hedera" will be logged to the console.

## Encryption Details

- **Encryption Algorithm**: AES-256-CBC
- **Fixed Key**: A 32-byte key derived from the string `'fixed_key'`.
- **Random IV**: A unique 16-byte initialization vector (IV) is generated for each message.
- **Payload Format**:
  ```json
  {
    "iv": "<hex-encoded IV>",
    "encrypted": "<hex-encoded ciphertext>"
  }
  ```

## Example Output

```plaintext
Topic created with ID: 0.0.5413310
Message sent: Hello, Hedera! | Status: SUCCESS
Message sent: Learning HCS | Status: SUCCESS
Message sent: Message 3 | Status: SUCCESS
Subscribing to messages containing 'Hedera':
Received: Hello, Hedera! | Consensus Timestamp: 2025-01-24T10:15:30.000Z
```

## Running the Script

Run the script using Node.js:

```bash
node index.js
```

## Notes

- The script uses Hedera Testnet, so no real hbars are required.
- Ensure that the Hedera Testnet is operational during testing.
- You can modify the `filterKeyword` parameter to filter specific messages.

## License

This project is licensed under the MIT License. Feel free to modify and distribute it as needed.

---

For
