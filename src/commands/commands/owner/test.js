const Command = require('../../Command.js');
const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            usage: 'test',
            description: `Functioning Test Command`,
            type: client.types.OWNER,
            ownerOnly: true
        });
    }
    async run(message, args) {
        const allButtons = [];
        const button = new MessageButton()
            .setCustomId(`Test`)
            .setLabel(`Test`)
            .setStyle("PRIMARY");

        allButtons.push(button);

        let rows = new Array(allButtons.length)
          .fill()
          .map((r) => {
            const row = new MessageActionRow();
            const buttons = allButtons[0];
            row.addComponents(buttons);
            return row;
          });
        let msg = await message.channel.send({
          components: rows,
          content: "Help"
        });

        const filter = (i) => {
          i.deferUpdate();
          return true;
        };

        msg
          .awaitMessageComponent({
            filter,
            componentType: "BUTTON"
          })
          .then((interaction) =>
            interaction.editReply(
              `You selected ${interaction.values.join(", ")}!`
            )
          )
          .catch((err) => console.log(`No interactions were collected.`));
    }
};
