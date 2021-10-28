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
      .setCustomId(`Test`)
      .setLabel(`Test`)
      .setStyle("PRIMARY");

    button.emoji("903101079300997181");

    allButtons.push(button);

    let rows = new Array(allButtons.length).fill().map((r) => {
      const row = new MessageActionRow();
      const buttons = allButtons[0];
      row.addComponents(buttons);
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
        // var json = serialize(interaction)
        // var fs = require("fs");
        // fs.writeFile(
        //   "./exports.json",
        //   json,
        //   "utf8",
        //   function readFileCallback(err) {
        //     if (err) {
        //       console.log(err);
        //     }
        //   }
        // );
        // var attachments = new MessageAttachment();
        // attachments.setFile("./exports.json");

        // interaction.channel.send({ files: [attachments], content: "Error Type" });
        interaction.member.send(`You selected ${interaction.customId}!`);
      })
      .catch((err) => console.log(err));
  }
};
