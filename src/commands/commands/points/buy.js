const Command = require("../../Command.js");
const { MessageEmbed } = require("discord.js");

module.exports = class buyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "buy",
      aliases: [],
      usage: "buy <item number> <amount>",
      description: "Buy a Specific Item from the Shop!",
      type: client.types.POINTS,
      examples: ["buy 1 1"],
      exclusive: true,
    });
  }
  async run(message, args) {
    if(args[0] == null) {
       return this.sendErrorMessage(message, 0, `Please provide a valid item!`);
    }

    if (args[1] == null) {
      return this.sendErrorMessage(message, 0, `Please provide a valid amount!`);
    }

    const items = [
      {
        name: "Odds Boost +1%",
        desc: "Boost your Odds by 1% for 24 Hours!",
        price: 2500,
        modifier: 1,
      },
      {
        name: "Odds Boost +1%",
        desc: "Boost your Odds by 1% for 48 Hours!",
        price: 5000,
        modifier: 1,
      },
      {
        name: "Odds Boost +1%",
        desc: "Boost your Odds by 1% forever!",
        price: 10000,
        modifier: 1,
      },
    ];

    const member =
      this.getMemberFromMention(message, args[0]) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const points = message.client.db.users.selectPoints
      .pluck()
      .get(member.id, message.guild.id);

    const itemNum = args[0] - 1;

    if(points >= items[itemNum].price) {
        message.client.db.users.updatePoints.run(
          { points: -items[itemNum].price },
          message.author.id,
          message.guild.id
        );

        let newOdds = (message.client.odds.get(member.id)?.win) + items[itemNum].price;

        message.client.odds.set(member.id, {
          lose: 100 - newOdds,
          win: newOdds,
        });
    }
  }
};
