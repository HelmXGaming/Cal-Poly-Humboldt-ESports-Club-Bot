// commands/add-role.js
module.exports = {
    name: 'add-role',
    description: 'Add a role to one or more users',
    async execute(message, args) {
        const targetRole = message.mentions.roles.first();
        if (!targetRole) return message.reply('❌ You must mention a valid role.');

        // Prevent assigning roles higher than the command user's top role
        if (targetRole.position >= message.member.roles.highest.position) {
            return message.reply('❌ You can’t assign a role higher or equal to your top role.');
        }

        const isEveryone = args.includes('everyone');

        if (isEveryone) {
            const members = await message.guild.members.fetch();
            const updatedMembers = [];

            for (const [, member] of members) {
                if (!member.roles.cache.has(targetRole.id) && member.manageable) {
                    try {
                        await member.roles.add(targetRole);
                        updatedMembers.push(member.user.tag);
                    } catch (error) {
                        console.error(`Failed to add role to ${member.user.tag}:`, error.message);
                    }
                }
            }

            return message.reply(`✅ Added role **${targetRole.name}** to ${updatedMembers.length} members.`);
        }

        const mentionedMembers = [...message.mentions.members.values()].filter(m => !m.roles.cache.has(targetRole.id) && !m.user.bot);

        if (mentionedMembers.length === 0) {
            return message.reply('❌ Mention at least one user to add the role to.');
        }

        for (const member of mentionedMembers) {
            try {
                await member.roles.add(targetRole);
            } catch (error) {
                console.error(`Failed to add role to ${member.user.tag}:`, error.message);
            }
        }

        return message.reply(`✅ Added role **${targetRole.name}** to ${mentionedMembers.map(m => m.user.username).join(', ')}`);
    }
};
