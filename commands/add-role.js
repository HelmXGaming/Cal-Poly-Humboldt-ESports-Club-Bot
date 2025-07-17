module.exports = {
    name: 'add-role',
    async execute(message, args) {
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply("❌ You don't have permission to manage roles.");
        }

        const member = message.mentions.members.first();
        const roleMention = message.mentions.roles.first();
        const roleName = args.slice(1).join(" ");
        let role;

        if (!member) {
            return message.reply("❌ Please mention a valid user.");
        }

        if (roleMention) {
            role = roleMention;
        } else {
            // fallback to searching by name
            role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
        }

        if (!role) {
            return message.reply(`❌ Could not find a role named **${roleName}**.`);
        }

        try {
            await member.roles.add(role);
            message.channel.send(`✅ Added role **${role.name}** to ${member.user.tag}`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Failed to add the role.");
        }
    }
};
