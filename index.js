// @ts-check

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('🌐 Uptime server running on port 3000'));

const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

  // Community Role
  if (addedRoles.some(role => role.name === 'Community')) {
    try {
      await newMember.send(
          `👋 Hey <@${newMember.user.id}>, Thanks for verifying! If you're a student at Cal Poly Humboldt and interested in becoming a member at the Esports Club, please fill out our https://discordapp.com/channels/774358478584021022/1367732965685202984 form!`
      );
      console.log(`✅ Sent Community DM to ${newMember.user.tag}`);
    } catch (error) {
      console.error(`⚠️ Could not send Community DM to ${newMember.user.tag}:`, error.message);
    }
  }

// Club Applicants Role (ID: 1392291571021643796)
  if (addedRoles.has('1392291571021643796')) {
    const logChannelId = '1367986477119836160'; // Club Submissions channel
    const moderatorRoleId = '1075654511386955816'; // Server Moderator role
    const logChannel = await client.channels.fetch(logChannelId);

    try {
      await newMember.send(
          `Hey <@${newMember.user.id}>, Thank you for applying to become a part of the **Cal Poly Humboldt Esports Club**!\n\n` +
          `To complete your application, please be sure to follow any instructions shared in the server. If you have any questions, reach out to any member of our leadership team.\n\n` +
          `We're excited to see your interest and can’t wait to learn more about you!`
      );

      console.log(`📩 Sent Club Applicants DM to ${newMember.user.tag}`);

      if (logChannel?.isTextBased()) {
        await logChannel.send(
            `📝 <@&${moderatorRoleId}>, ${newMember.user.tag} has been given the **Club Applicants** role and is ready for review.`
        );
      }

    } catch (error) {
      console.error(`⚠️ Could not send Club Applicants DM to ${newMember.user.tag}:`, error.message);

      if (logChannel?.isTextBased()) {
        await logChannel.send(
            `⚠️ <@&${moderatorRoleId}>, failed to DM ${newMember.user.tag} after assigning **Club Applicants** role: ${error.message}`
        );
      }
    }
  }
});

client.login(process.env.TOKEN).catch(console.error);
