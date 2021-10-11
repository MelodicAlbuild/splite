const Command = require('../../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class clearSystemChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearsupportchannel',
      aliases: ['clearspc', 'cspc'],
      usage: 'clearsupportchannel',
      description: oneLine`
        Clears the support text channel for your server.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['clearsupportchannel']
    });
  }
  run(message, args) {
    const systemChannelId = message.client.db.settings.selectSupportChannelId
      .pluck()
      .get(message.guild.id);
    const oldSystemChannel = message.guild.channels.cache.get(systemChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Support`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`support channel\` was successfully cleared. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
      message.client.db.settings.updateSupportChannelId.run(
        null,
        message.guild.id
      );
      return message.channel.send({
        embeds: [
          embed.addField("Support Channel", `${oldSystemChannel} ➔ \`None\``),
        ],
      });

  }
};
