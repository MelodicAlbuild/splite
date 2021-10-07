const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../Command.js");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = class reactionMenu extends Command {
  constructor(client) {
    super(client, {
      name: "reactionmenu",
      aliases: ["rr"],
      usage: "reactionmenu",
      description: "Create a new Reaction Role Selector",
      type: client.types.ADMIN,
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
            .setName("title")
            .setDescription("The Text that Appears in the Role Select.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role1")
            .setDescription("The First Role in the List")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role2")
            .setDescription("The Second Role in the List")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role3")
            .setDescription("The Third Role in the List")
            .setRequired(false)
        )
        .addRoleOption((option) =>
          option
            .setName("role4")
            .setDescription("The Fourth Role in the List")
            .setRequired(false)
        )
        .addRoleOption((option) =>
          option
            .setName("role5")
            .setDescription("The Fifth Role in the List")
            .setRequired(false)
        )
        
    });
  }

  async run(interaction, args) {
    var optionArray = []
    for (var arg = 1; arg < args.length; ++arg) {
      var arr = args[arg];
      optionArray[arg - 1] = {
        label: arr.role.name,
        description: "Server: " + arr.role.guild.name,
        value: arr.role.id
      };
    }
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("roleList")
        .setPlaceholder("No Roles Yet")
        .addOptions(optionArray)
    );

    await interaction.reply({ content: args[0].value, components: [row] });
  }
};
