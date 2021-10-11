const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../Command.js");

module.exports = class reactionMenu extends Command {
  constructor(client) {
    super(client, {
      name: "support",
      aliases: ["su"],
      usage: "support <user id> <message>",
      description: "Reply to a Support Request",
      type: client.types.MOD,
      clientPermissions: [
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "ADD_REACTIONS",
        "MANAGE_ROLES",
      ],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: false,
      cooldown: 5,
      slashCommand: new SlashCommandBuilder()
        .addStringOption((option) =>
          option
            .setName("userid")
            .setDescription("The Current User ID to Reply To")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message to send the User")
            .setRequired(true)
        ),
    });
  }

  async run(interaction, args) {
      let user1 = interaction.client.users.cache.get(args[0].value);
      await user1.send(`**From ${interaction.user.tag}, in ${interaction.guild.name}:**\n` + args[1].value);
      await interaction.reply({
        content: `Message sent to <@${args[0].value}> from **${interaction.user.tag}**.`,
      });
  }
};
