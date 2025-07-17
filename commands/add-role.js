module.exports = {
    name: 'add-role',
    async execute(message, args) {
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply("❌ You don't have permission to manage roles.");
        }

        const roleMention = message.mentions.roles.first();
        const userMention = message.mentions.members.first();
        const allMentions = message.mentions.roles.map(r => r.id).concat(message.mentions.members.map(m => m.id));

        if (!roleMention) {
            return message.reply("❌ Please mention a valid role to add.");
        }

        const targetRole = roleMention;
        const guild = message.guild;

        // If only 1 mention and it's a role → apply to everyone
        if (allMentions.length === 1 && !userMention) {
            try {
                const members = await guild.members.fetch();
                members.forEach(member => {
                    if (!member.user.bot) member.roles.add(targetRole).catch(() => {});
                });

                message.channel.send(`✅ Added role **${targetRole.name}** to everyone.`);
            } catch (err) {
                console.error(err);
                message.reply("❌ Failed to assign role to everyone.");
            }
            return;
        }

        // If both role and user are mentioned → assign role to that user
        if (roleMention && userMention) {
            try {
                await userMention.roles.add(targetRole);
                return message.channel.send(`✅ Added role **${targetRole.name}** to ${userMention.user.tag}`);
            } catch (err) {
                console.error(err);
                return message.reply("❌ Failed to assign the role to user.");
            }
        }

        // Support: !add-role @TargetRole with @ExistingRole
        if (args.includes("with") && message.mentions.roles.length === 2) {
            const existingRole = message.mentions.roles[1];

            try {
                const members = await guild.members.fetch();
                const filtered = members.filter(m => m.roles.cache.has(existingRole.id));
                for (const member of filtered.values()) {
                    await member.roles.add(targetRole).catch(() => {});
                }

                message.channel.send(`✅ Added role **${targetRole.name}** to members who already have **${existingRole.name}**.`);
            } catch (err) {
                console.error(err);
                return message.reply("❌ Failed to apply role based on existing role.");
            }
            return;
        }

        message.reply("❌ Couldn't determine how to apply role. Use `!add-role @role`, `!add-role @role @user`, or `!add-role @role with @role`.");
    }
};
