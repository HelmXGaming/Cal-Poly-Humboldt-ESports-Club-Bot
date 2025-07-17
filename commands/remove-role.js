module.exports = {
    name: 'remove-role',
    description: 'Removes a role from mentioned users or everyone',
    async execute(message) {
        const args = message.content.split(' ').slice(1);
        if (args.length < 2) return message.reply('Usage: `!remove-role @role @user1 @user2 ...` or `!remove-role @role everyone`');

        const targetRole = message.mentions.roles.first();
        if (!targetRole) return message.reply('❌ You must mention a valid role.');

        if (targetRole.position >= message.member.roles.highest.position && message.guild.ownerId !== message.member.id) {
            return message.reply(`❌ You can't remove the **${targetRole.name}** role. It's higher or equal to your highest role.`);
        }

        const mentionedMembers = message.mentions.members;

        if (args.includes('everyone')) {
            const members = await message.guild.members.fetch();
            members.forEach(async (member) => {
                if (!member.user.bot && member.roles.cache.has(targetRole.id)) {
                    if (
                        targetRole.position >= message.member.roles.highest.position &&
                        message.guild.ownerId !== message.member.id
                    ) return;

                    await member.roles.remove(targetRole).catch(() => {});
                }
            });

            return message.reply(`✅ Removed role **${targetRole.name}** from all users.`);
        }

        if (mentionedMembers.size < 2) return message.reply('❌ Mention at least one user to remove the role from.');

        mentionedMembers.forEach(async (member) => {
            if (member.roles.cache.has(targetRole.id)) {
                await member.roles.remove(targetRole).catch(() => {});
            }
        });

        return message.reply(`✅ Removed role **${targetRole.name}** from selected members.`);
    }
};
