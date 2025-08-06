const { logBotAction } = require('../utils/logger');

module.exports = {
    name: 'add-role',
    description: 'Adds a role to mentioned users or everyone.',
    async execute(message) {
        const roleMention = message.mentions.roles.first();
        const userMentions = message.mentions.members;

        if (!roleMention) {
            return message.reply('❌ Please mention a valid role to add.');
        }

        if (userMentions.size === 0 && !message.content.toLowerCase().includes('everyone')) {
            return message.reply('❌ Mention at least one user or say "everyone" to add the role to.');
        }

        // Prevent elevating roles above your own
        if (
            roleMention.position >= message.member.roles.highest.position &&
            message.member.id !== message.guild.ownerId
        ) {
            return message.reply(`❌ You can't assign the **${roleMention.name}** role. It's higher or equal to your highest role.`);
        }

        let targets = [];

        if (message.content.toLowerCase().includes('everyone')) {
            targets = message.guild.members.cache.filter(
                member => !member.user.bot && !member.roles.cache.has(roleMention.id)
            );
        } else {
            targets = userMentions.filter(member => !member.roles.cache.has(roleMention.id));
        }

        if (targets.size === 0) {
            return message.reply('ℹ️ Everyone already has this role.');
        }

        let success = 0,
            failed = 0;

        for (const member of targets.values()) {
            try {
                await member.roles.add(roleMention);
                success++;
                await logBotAction(`✅ ${message.author.tag} added role **${roleMention.name}** to ${member.user.tag}`);
            } catch {
                failed++;
                await logBotAction(`❌ ${message.author.tag} failed to add role **${roleMention.name}** to ${member.user.tag}`);
            }
        }

        await logBotAction(
            `📊 ${message.author.tag} attempted to add role **${roleMention.name}** — Success: ${success}, Failed: ${failed}`
        );

        return message.reply(
            `✅ Added role **${roleMention.name}** to ${success} user(s). ${failed ? `❌ Failed on ${failed}.` : ''}`
        );
    }
};
