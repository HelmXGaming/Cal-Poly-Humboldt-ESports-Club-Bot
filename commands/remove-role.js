module.exports = {
    name: 'remove-role',
    description: 'Removes a role from mentioned users or everyone.',
    async execute(message) {
        const roleMention = message.mentions.roles.first();
        const userMentions = message.mentions.members;

        if (!roleMention) {
            return message.reply('❌ Please mention a valid role to remove.');
        }

        if (userMentions.size === 0 && !message.content.toLowerCase().includes('everyone')) {
            return message.reply('❌ Mention at least one user or say "everyone" to remove the role from.');
        }

        // Prevent removing roles higher or equal to the invoker’s highest role
        if (roleMention.position >= message.member.roles.highest.position && message.member.id !== message.guild.ownerId) {
            return message.reply(`❌ You can't remove the **${roleMention.name}** role. It's higher or equal to your highest role.`);
        }

        let targets = [];

        if (message.content.toLowerCase().includes('everyone')) {
            targets = message.guild.members.cache.filter(member =>
                !member.user.bot && member.roles.cache.has(roleMention.id)
            );
        } else {
            targets = userMentions.filter(member => member.roles.cache.has(roleMention.id));
        }

        if (targets.size === 0) {
            return message.reply('ℹ️ No one currently has that role.');
        }

        let success = 0, failed = 0;

        for (const member of targets.values()) {
            try {
                await member.roles.remove(roleMention);
                success++;
            } catch {
                failed++;
            }
        }

        return message.reply(`✅ Removed role **${roleMention.name}** from ${success} user(s). ${failed ? `❌ Failed on ${failed}.` : ''}`);
    }
};
