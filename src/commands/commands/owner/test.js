const Command = require("../../Command.js");
const {
  MessageButton,
  MessageActionRow,
  MessageAttachment,
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

    let rows = new Array(allButtons.length).fill().map((r) => {
      const row = new MessageActionRow();
      const buttons = allButtons.splice(0);
      buttons.forEach((b) => {
        row.addComponents(b);
      });
      return row;
    });
    let msg = await message.channel.send({
      components: rows,
      content: "Help",
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
      .then((interaction) => {
        if(interaction.customId == "Minecraft") {
            interaction.member.roles.add(
              guild.roles.fetch("903103995294408734")
            );
            interaction.member.send(`Temp Message`)
        } else if(interaction.customId == "Madden") {
            interaction.member.roles.add(
              guild.roles.fetch("903103848506359928")
            );
            interaction.member.send(`Temp Message`);
        }
      })
      .catch((err) => console.log(err));
  }
};
