const Command = require('../../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetSupportChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setsupportchannel',
      aliases: ['setspc', 'sspc'],
      usage: 'setsupportchannel <channel mention/ID>',
      description: oneLine`
        Sets the support text channel for your server. This is where ${client.name}'s support messages will be sent. 
        Provide no channel to clear the current \`support channel\`.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setsupportchannel #general', 'clearsupportchannel']
    });
  }
  run(message, args) {
    const systemChannelId = message.client.db.settings.selectSupportChannelId.pluck().get(message.guild.id);
    const oldSystemChannel = message.guild.channels.cache.get(systemChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Support`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      return message.channel.send({embeds: [embed.addField('Current Support Channel', `${oldSystemChannel}`).setDescription(this.description)]});
    }
    embed.setDescription(`The \`support channel\` was successfully updated. ${success}\n Use \`clearsupportchannel\` to clear the current \`support channel\``)
    const systemChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!systemChannel || (systemChannel.type != 'GUILD_TEXT' && systemChannel.type != 'GUILD_NEWS') || !systemChannel.viewable)
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);
    message.client.db.settings.updateSupportChannelId.run(systemChannel.id, message.guild.id);
    message.channel.send({embeds: [embed.addField('Support Channel', `${oldSystemChannel} ➔ ${systemChannel}`)]});
  }
};
