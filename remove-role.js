module.exports = {
    name: 'remove-role',
    description: 'Removes a role from a user or everyone',
    async execute(message, args) {
        if (!message.member.permissions.has('ManageRoles')) {
            return message.reply("🚫 You don’t have permission to manage roles.");
        }

        const roleName = args.join(' ').trim();
        const role = message.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            return message.reply(`❌ Role "${roleName}" not found.`);
        }

        let targets;
        if (message.mentions.members.size > 0) {
            targets = message.mentions.members;
        } else {
            targets = message.guild.members.cache;
        }

        targets.forEach(member => {
            if (member.roles.cache.has(role.id)) {
                member.roles.remove(role).catch(console.error);
            }
        });

        message.channel.send(`✅ Removed role **${role.name}** from ${targets.size} member(s).`);
    }
};
