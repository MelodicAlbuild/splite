const Command = require("../../Command.js");
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require("discord.js");

var serialize = require("serialize-javascript");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      usage: "test",
      description: `Functioning Test Command`,
      type: client.types.OWNER,
      ownerOnly: true,
    });
  }
  async run(message, args) {
    const allButtons = [];
    const button = new MessageButton()
      .setCustomId(`Minecraft`)
      .setLabel(`Minecraft`)
      .setStyle("SUCCESS");
    button.emoji = { name: "grassblock", id: "903101079300997181" };
    allButtons.push(button);

    const button2 = new MessageButton()
      .setCustomId(`Madden`)
      .setLabel(`Madden`)
      .setStyle("PRIMARY");
    button2.emoji = { name: "nfl", id: "903102675191742494" };
    allButtons.push(button2);

    let rows = new Array(1).fill().map((r) => {
      const row = new MessageActionRow();
      allButtons.forEach((b) => {
        row.addComponents(b);
      });
      return row;
    });

    let dmembed = new MessageEmbed()
      .setTitle("Newly Available Roles")
      .setDescription(
        "There are some new roles you can check out!\nSelect from the Buttons below to pick the ones you want!"
      )
      .setColor("#08a100")
      .setFooter("New Optional Discord Roles")
      .addField(
        "<:grassblock:903101079300997181> Minecraft",
        "We are taking community interest in a Minecraft Team, If you are interested indicate that by selecting this role.",
        true
      )
      .addField(
        "<:nfl:903102675191742494> Madden",
        "We are taking community interest in a Madden Team, If you are interested indicate that by selecting this role.",
        true
      )
      .setAuthor(
        "MelodicAlbuild",
        "https://cdn.discordapp.com/avatars/392502749876584448/7d3ab8457b9509dc783f447c4a77da55.webp?size=80"
      );

    let msg = await message.channel.send({
      components: rows,
      embeds: [dmembed]
    });

    const filter = (i) => {
      i.deferUpdate();
      return true;
    };

    msg
      .awaitMessageComponent({
        filter,
        componentType: "BUTTON",
      })
      .then(async (interaction) => {

        let masterEmbed = new MessageEmbed()
          .setTitle("Thank You!")
          .setDescription(
            "Thank you for showing interest in our new team ideas!"
          )
          .setAuthor(
            "MelodicAlbuild",
            "https://cdn.discordapp.com/avatars/392502749876584448/7d3ab8457b9509dc783f447c4a77da55.webp?size=80"
          );

        if(interaction.customId == "Minecraft") {
            var role = await interaction.guild.roles.fetch("903103995294408734");
            interaction.member.roles.add(
              role
            );
            masterEmbed.setColor("#00731f");
            masterEmbed.addField("Role Selected", "Minecraft");
            interaction.member.send({ embeds: [masterEmbed] });
        } else if(interaction.customId == "Madden") {
            var role = await interaction.guild.roles.fetch("903103848506359928");
            interaction.member.roles.add(
              role
            );
            masterEmbed.setColor("#102cb5");
            masterEmbed.addField("Role Selected", "Madden");
            interaction.member.send({embeds: [masterEmbed]});
        }
      })
      .catch((err) => console.log(err));
  }
};
