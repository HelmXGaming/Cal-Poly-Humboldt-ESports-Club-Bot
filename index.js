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
        `👋 Hey <@${newMember.user.id}>, thanks for verifying! If you're a student at Cal Poly Humboldt and interested in becoming a member at the Esports Club, please fill out our https://discordapp.com/channels/774358478584021022/1367732965685202984 form!`
      );
      console.log(`✅ Sent Community DM to ${newMember.user.tag}`);
    } catch (error) {
      console.error(`⚠️ Could not send Community DM to ${newMember.user.tag}:`, error.message);
    }
  }

  // Club Members Role
  if (addedRoles.some(role => role.name === 'Club Members')) {
    try {
      await newMember.send(
        `🎉 Woohoo! You're now an official Cal Poly Humboldt Esports Club Member!

To vote for what games we should add to our competitive roster, please fill out this form:
https://docs.google.com/forms/d/e/1FAIpQLSfVfvu9zORqJgw9gLZesSYmD6EdBJyns-9noybdib-GfvV0ag/viewform?usp=sharing

If you're interested in joining our amazing administration team, please send a DM to either @President or @Vice President.

We're so excited to have you in the club! If you have any questions, feel free to reach out to anyone on our leadership team.`
      );
      console.log(`✅ Sent Club Members DM to ${newMember.user.tag}`);
    } catch (error) {
      console.error(`⚠️ Could not send Club Members DM to ${newMember.user.tag}:`, error.message);
    }
  }
});

client.login(process.env.TOKEN);
