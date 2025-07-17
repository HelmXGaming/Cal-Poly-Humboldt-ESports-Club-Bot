module.exports = {
    name: 'add-role',
    description: 'Adds a role to mentioned users or everyone',
    async execute(message) {
        const args = message.content.split(' ').slice(1);
        if (args.length < 2) return message.reply('Usage: `!add-role @role @user1 @user2 ...` or `!add-role @role everyone`');

        const targetRole = message.mentions.roles.first();
        if (!targetRole) return message.reply('❌ You must mention a valid role.');

        if (targetRole.position >= message.member.roles.highest.position && message.guild.ownerId !== message.member.id) {
            return message.reply(`❌ You can't assign the **${targetRole.name}** role. It's higher or equal to your highest role.`);
        }

        const mentionedMembers = message.mentions.members;

        if (args.includes('everyone')) {
            const members = await message.guild.members.fetch();
            members.forEach(async (member) => {
                if (!member.user.bot && !member.roles.cache.has(targetRole.id)) {
                    if (
                        targetRole.position >= message.member.roles.highest.position &&
                        message.guild.ownerId !== message.member.id
                    ) return;

                    await member.roles.add(targetRole).catch(() => {});
                }
            });

            return message.reply(`✅ Added role **${targetRole.name}** to all users.`);
        }

        if (mentionedMembers.size < 2) return message.reply('❌ Mention at least one user to add the role to.');

        mentionedMembers.forEach(async (member) => {
            if (!member.roles.cache.has(targetRole.id)) {
                await member.roles.add(targetRole).catch(() => {});
            }
        });

        return message.reply(`✅ Added role **${targetRole.name}** to selected members.`);
    }
};
