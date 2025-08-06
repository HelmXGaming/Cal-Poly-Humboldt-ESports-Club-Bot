// utils/logger.js

const { client } = require('../index'); // Ensure client is exported in index.js

const LOG_CHANNEL_ID = '1402494319193231371';

async function logBotAction(content) {
    try {
        const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
        if (logChannel?.isTextBased()) {
            await logChannel.send({ content });
        }
    } catch (error) {
        console.error("⚠️ Failed to log bot action:", error.message);
    }
}

module.exports = { logBotAction };
