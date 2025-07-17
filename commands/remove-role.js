// commands/remove-role.js
module.exports = {
    name: 'remove-role',
    description: 'Remove a role from one or more users',
    async execute(message, args) {
        const targetRole = message.mentions.roles.first();
        if (!targetRole) return message.reply('❌ You must mention a valid role.');

        if (targetRole.position >= message.member.roles.highest.position) {
            return message.reply('❌ You can’t remove a role higher or equal to your top role.');
        }

        const isEveryone = args.includes('everyone');

        if (isEveryone) {
            const members = await message.guild.members.fetch();
            const updatedMembers = [];

            for (const [, member] of members) {
                if (member.roles.cache.has(targetRole.id) && member.manageable) {
                    try {
                        await member.roles.remove(targetRole);
                        updatedMembers.push(member.user.tag);
                    } catch (error) {
                        console.error(`Failed to remove role from ${member.user.tag}:`, error.message);
                    }
                }
            }

            return message.reply(`✅ Removed role **${targetRole.name}** from ${updatedMembers.length} members.`);
        }

        const mentionedMembers = [...message.mentions.members.values()].filter(m => m.roles.cache.has(targetRole.id) && !m.user.bot);

        if (mentionedMembers.length === 0) {
            return message.reply('❌ Mention at least one user to remove the role from.');
        }

        for (const member of mentionedMembers) {
            try {
                await member.roles.remove(targetRole);
            } catch (error) {
                console.error(`Failed to remove role from ${member.user.tag}:`, error.message);
            }
        }

        return message.reply(`✅ Removed role **${targetRole.name}** from ${mentionedMembers.map(m => m.user.username).join(', ')}`);
    }
};
