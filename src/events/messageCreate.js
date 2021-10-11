const { MessageEmbed } = require('discord.js');
const { online, dnd } = require('../utils/emojis.json')
const moment = require('moment')
const { oneLine } = require('common-tags');
const {nsfw} = require('../utils/emojis.json')
const Discord = require('discord.js');

module.exports = async (client, message) => {
  if (message.author.bot) return;

    if (message.channel.type == "DM") {
      const category = await client.channels.cache.get("896963859183722536");
      const channelName = category.children.filter((ch) => ch.name == message.author.id);
      if(channelName != null) {
        channelName.send(
          `**From ${message.author.tag} at ${message.createdTimestamp}:**\n` +
            message.content
        );
      } else {
        category.guild.channels.create(message.author.id, {
          type: 'GUILD_TEXT'
        }).then(c => c.setParent(category.id)).then(cha => {
          let dmauthor = message.author;
          let dmmessage = message.content;
          let dmembed = new Discord.MessageEmbed()
            .setTitle("Incoming Support Request")
            .setColor("#00ffff")
            .addField("Author", message.author.username)
            .addField("Author ID", message.author.id)
            .addField("Support Message", dmmessage);
          return (
            cha.send({ embeds: [dmembed] }),
            dmauthor.send(
              "The Staff have been Notified of your Issue, They will reply here shortly!"
            )
          );
        })
      }
    }

    //Update MessageCount
    client.db.users.updateMessageCount.run(
      { messageCount: 1 },
      message.author.id,
      message.guild.id
    );

  const {
    afk: currentStatus,
    afk_time: afkTime
  } = message.client.db.users.selectAfk.get(message.guild.id, message.author.id);

  if (currentStatus != null) {
    const d = new Date(afkTime)
    message.client.db.users.updateAfk.run(null, message.author.id, message.guild.id)
    if (message.member.nickname) message.member.setNickname(`${message.member.nickname.replace('[AFK]', '')}`).catch(err => {})
    message.channel.send(`${online} Welcome back ${message.author}, you went afk **${moment(d).fromNow()}**!`).then(msg => {
      setTimeout(() => msg.delete(), 5000);
    })
  }

  if (message.mentions.users.size > 0) {
    message.mentions.users.forEach(user => {
      const {
        afk: currentStatus,
        afk_time: afkTime
      } = message.client.db.users.selectAfk.get(message.guild.id, user.id);
      if (currentStatus != null) {
        const d = new Date(afkTime)
        message.channel.send(`${dnd} ${user.username} is afk${currentStatus ? `: ${currentStatus} -` : '!'} **${moment(d).fromNow()}**`)
      }
    })
  }

  // Get disabled commands
  let disabledCommands = client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
  if (typeof (disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

  // Get points
  const {point_tracking: pointTracking, message_points: messagePoints, command_points: commandPoints} =
      client.db.settings.selectPoints.get(message.guild.id);

  // Command handler
  const prefix = client.db.settings.selectPrefix.pluck().get(message.guild.id);
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

  if (prefixRegex.test(message.content)) {

    // Get mod channels
    let modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id) || [];
    if (typeof (modChannelIds) === 'string') modChannelIds = modChannelIds.split(' ');

    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
    if (command && !disabledCommands.includes(command.name)) {
      const cooldown = await command.isOnCooldown(message.author.id)
      if (cooldown)
        return message.reply({embeds: [new MessageEmbed().setDescription(`You are on a cooldown. Try again in **${cooldown}** seconds.`)]}).then(msg=>{
          setTimeout(()=>msg.delete(), 3000)
        });

      const instanceExists = command.isInstanceRunning(message.author.id)
      if (instanceExists)
        return message.reply({embeds: [new MessageEmbed().setDescription(`Command already in progress, please wait for it.`)]}).then(msg=>{
          setTimeout(()=>msg.delete(), 3000)
        });

      // Check if mod channel
      if (modChannelIds.includes(message.channel.id)) {
        if (command.type != client.types.MOD || (command.type == client.types.MOD && message.channel.permissionsFor(message.author).missing(command.userPermissions) != 0)) {
          // Update points with messagePoints value
          if (pointTracking) client.db.users.updatePoints.run({points: messagePoints}, message.author.id, message.guild.id);
          return message.channel.send(`This is a mod-only channel. Only Mod commands may be used in this channel.\nTo reset this, an admin has to use \`${prefix}clearcommandchanels\` in another channel`).then(m=>setTimeout(()=>m.delete(), 15000)); // Return early so bot doesn't respond
        }
      }

      // Check permissions
      const permissionErrors = command.checkPermissionErrors(message.member, message.channel, message.guild);
      if (!permissionErrors) return;
      if (permissionErrors instanceof MessageEmbed) return message.reply({embeds: [permissionErrors]})
      if (!command.checkNSFW(message.channel))
        return message.reply({
          embeds: [new MessageEmbed()
              .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
              .setDescription(`${nsfw} NSFW Commands can only be run in NSFW channels.`)
              .setTimestamp()
              .setColor("RED")]
        })

      // Update points with commandPoints value
      if (pointTracking)
        client.db.users.updatePoints.run({points: commandPoints}, message.author.id, message.guild.id);
      message.command = true; // Add flag for messageUpdate event
      message.channel.sendTyping();
      command.setInstance(message.author.id);
      command.setCooldown(message.author.id);
      return command.run(message, args); // Run command

    } else if (
        (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
        message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
        !modChannelIds.includes(message.channel.id)
    ) {
      const embed = new MessageEmbed()
          .setTitle(`Hi, I\'m ${client.name}. Need help?`)
          .setThumbnail('https://i.imgur.com/B0XSinY.png')
          .setDescription(`You can see everything I can do by using the \`${prefix}help\` command.`)
          .addField('Invite Me', oneLine`
          You can add me to your server by clicking 
          [here](${message.client.link})!
        `)
          .addField('Support', oneLine`
          If you have questions, suggestions, or found a bug, please use the 'report' or 'feedback' commands`)
          .setFooter(`DM ${message.client.ownerTag} to speak directly with the developer!`)
          .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds: [embed]});
    }
  }

  // Update points with messagePoints value
  if (pointTracking) client.db.users.updatePoints.run({points: messagePoints}, message.author.id, message.guild.id);
};