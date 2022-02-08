const Command = require("../../Command.js");
const { MessageEmbed } = require("discord.js");

module.exports = class shopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "shop",
      aliases: [],
      usage: "shop",
      description: "Open the Shop",
      type: client.types.POINTS,
      examples: ["shop"],
      exclusive: true,
    });
  }
  async run(message, args) {
    const items = [
      {
        name: "Odds Boost +1%",
        desc: "Boost your Odds by 1% for 24 Hours!",
        price: 2500,
      },
      {
        name: "Odds Boost +1%",
        desc: "Boost your Odds by 1% for 48 Hours!",
        price: 5000,
      },
      {
        name: "Odds Boost +1%",
        desc: "Boost your Odds by 1% forever!",
        price: 10000,
      },
    ];

    const embed = new MessageEmbed().setTitle("Shop").setColor("#4be373").setFooter("Shop Updates Every 24 Hours!");

    items.forEach((item) => {
      embed.addField(item.name + " | " + item.price + " Points", item.desc, true);
    });

    message.channel.send({embeds: [embed]});
  }
};
