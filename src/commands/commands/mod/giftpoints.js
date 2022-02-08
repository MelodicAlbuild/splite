const Command = require("../../Command.js");
const { MessageEmbed } = require("discord.js");

module.exports = class giftPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "giftpoints",
      aliases: ["gift"],
      usage: "giftpoints <user mention/ID> <point count> <reason>",
      description:
        "Gifts the Mentioned User X Points for a Specific Reason",
      type: client.types.MOD,
      examples: ["giftpoints @MelodicAlbuild 50 Play of the Game"],
    });
  }

  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    let reason = "";
    let i = 0;
    args.forEach(arg => {
        if(i != 0 && i != 1) {
            reason += arg;
        } else {
            i++;
        }
    })
    if (!member) return this.sendErrorMessage(message, 0, `Please mention a user or provide a valid user ID`);
    if (member.id === message.client.user.id)
      return message.channel.send(`${emojis.fail} Thank you, you\'re too kind! But I must decline. I prefer not to take handouts.`);
    const amount = parseInt(args[1]);
    // Add points
    const oldPoints = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    message.client.db.users.updatePoints.run({ points: amount }, member.id, message.guild.id);
    let description;
    if (amount === 1) description = `${emojis.success} Successfully gifted **${amount}** points ${emojis.point} to ${member}!`;
    else description = `${emojis.success} Successfully gifted **${amount}** points ${emojis.point} to ${member}!`;
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Points ${emojis.point}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(description)
      .addField('To', member.toString(), true)
      .addField('Reason', reason, true)
      .addField('Points', `\`${oldPoints}\` ➔ \`${amount + oldPoints}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
