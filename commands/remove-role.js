module.exports = {
    name: 'remove-role',
    async execute(message, args) {
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply("❌ You don't have permission to manage roles.");
        }

        const roleMention = message.mentions.roles.first();
        const userMention = message.mentions.members.first();
        const allMentions = message.mentions.roles.map(r => r.id).concat(message.mentions.members.map(m => m.id));

        if (!roleMention) {
            return message.reply("❌ Please mention a valid role to remove.");
        }

        const targetRole = roleMention;
        const guild = message.guild;

        // If only 1 mention and it's a role → remove from everyone
        if (allMentions.length === 1 && !userMention) {
            try {
                const members = await guild.members.fetch();
                members.forEach(member => {
                    if (!member.user.bot && member.roles.cache.has(targetRole.id)) {
                        member.roles.remove(targetRole).catch(() => {});
                    }
                });

                message.channel.send(`✅ Removed role **${targetRole.name}** from everyone.`);
            } catch (err) {
                console.error(err);
                message.reply("❌ Failed to remove role from everyone.");
            }
            return;
        }

        // If both role and user are mentioned → remove role from that user
        if (roleMention && userMention) {
            try {
                await userMention.roles.remove(targetRole);
                return message.channel.send(`✅ Removed role **${targetRole.name}** from ${userMention.user.tag}`);
            } catch (err) {
                console.error(err);
                return message.reply("❌ Failed to remove the role from user.");
            }
        }

        // Support: !remove-role @TargetRole with @ExistingRole
        if (args.includes("with") && message.mentions.roles.length === 2) {
            const existingRole = message.mentions.roles[1];

            try {
                const members = await guild.members.fetch();
                const filtered = members.filter(m => m.roles.cache.has(existingRole.id) && m.roles.cache.has(targetRole.id));
                for (const member of filtered.values()) {
                    await member.roles.remove(targetRole).catch(() => {});
                }

                message.channel.send(`✅ Removed role **${targetRole.name}** from members who had **${existingRole.name}**.`);
            } catch (err) {
                console.error(err);
                return message.reply("❌ Failed to remove role based on existing role.");
            }
            return;
        }

        message.reply("❌ Couldn't determine how to remove role. Use `!remove-role @role`, `!remove-role @role @user`, or `!remove-role @role with @role`.");
    }
};
