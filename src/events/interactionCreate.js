const { MessageEmbed, MessageAttachment } = require("discord.js");
const Discord = require("discord.js");

var serialize = require("serialize-javascript");

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    let command = client.slashCommands.get(interaction.commandName);
    if (command) {
      const cooldown = await command.isOnCooldown(interaction.user.id);
      if (cooldown)
        return interaction.reply({
          embeds: [
            new MessageEmbed().setDescription(
              `You are on a cooldown. Try again in **${cooldown}** seconds.`
            ),
          ],
          ephemeral: true,
        });

      const instanceExists = command.isInstanceRunning(interaction.user.id);
      if (instanceExists)
        return interaction.reply({
          embeds: [
            new MessageEmbed().setDescription(
              `Command already in progress, please wait for it.`
            ),
          ],
          ephemeral: true,
        });

      const author = await interaction.guild.members.cache.get(
        interaction.user.id
      );
      const channel = await interaction.guild.channels.cache.get(
        interaction.channelId
      );

      const permissionErrors = command.checkPermissionErrors(
        author,
        channel,
        interaction.guild
      );
      if (!permissionErrors) return;
      if (permissionErrors instanceof MessageEmbed)
        return interaction.reply({
          embeds: [permissionErrors],
          ephemeral: true,
        });

      let disabledCommands =
        client.db.settings.selectDisabledCommands
          .pluck()
          .get(interaction.guild.id) || [];
      if (typeof disabledCommands === "string")
        disabledCommands = disabledCommands.split(" ");

      if (!disabledCommands?.includes(command.name)) {
        if (!command.checkNSFW(channel)) {
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setAuthor(
                  `${interaction.user.username}#${interaction.user.discriminator}`,
                  command.getAvatarURL(interaction.user)
                )
                .setDescription(
                  `NSFW Commands can only be run in NSFW channels.`
                )
                .setTimestamp()
                .setColor("RED"),
            ],
            ephemeral: true,
          });
        }

        command.setCooldown(interaction.user.id);
        command.setInstance(interaction.user.id);

        return command.run(
          interaction,
          interaction.options._hoistedOptions || null
        ); // Run command
      }
    }
  } else if(interaction.isButton()) {
    let masterEmbed = new MessageEmbed()
          .setTitle("Thank You!")
          .setDescription(
            "Thank you for showing interest in our new team ideas!"
          )
          .setAuthor(
            "MelodicAlbuild",
            "https://cdn.discordapp.com/avatars/392502749876584448/7d3ab8457b9509dc783f447c4a77da55.webp?size=80"
          );

        function lookup(type) {
          if(type == "PRIMARY") {
            return "#5865F2";
          } else if(type == "SECONDARY") {
            return "#4f545c";
          } else if(type == "SUCCESS") {
            return "#57F287";
          } else if(type == "DANGER") {
            return "#ED4245";
          }
        }

        let mainMessage = await client.channels.cache.get('910639165392175114').messages.fetch('910639655962173471');

        let maddenValue;
        let minecraftValue;
        let haloValue;

        maddenValue = parseInt(mainMessage.embeds[0].fields[0].value);
        minecraftValue = parseInt(mainMessage.embeds[0].fields[1].value);
        haloValue = partseInt(mainMessage.embeds[0].fields[1].value);

        interaction.message.components[0].components.forEach(async function (obj) {
          if(obj.customId == interaction.customId) {
            var role = await interaction.guild.roles.fetch(
              interaction.customId
            );
            interaction.member.roles.add(role);
            masterEmbed.setColor(lookup(obj.style));
            masterEmbed.addField("Role Selected", obj.label);
            if (interaction.customId == "903103995294408734") {
              maddenValue += 1;
            } else if (interaction.customId == "903103848506359928") {
              minecraftValue += 1;
            } else if (interaction.customId == "910712217131950120") {
              haloValue += 1;
            } else {
              console.log("No Interaction match");
            }
            await interaction.member.send({ embeds: [masterEmbed] });

            let numberEmbed = new MessageEmbed()
              .setTitle("Selected Roles")
              .setDescription(
                "Selected Roles and How Many People have Selected Them"
              )
              .setAuthor(
                "MelodicAlbuild",
                "https://cdn.discordapp.com/avatars/392502749876584448/7d3ab8457b9509dc783f447c4a77da55.webp?size=80"
              )
              .addField("Minecraft", maddenValue.toString(), true)
              .addField("Madden", minecraftValue.toString(), true)
              .addField("Halo Infinite", haloValue.toString(), true);

            await client.channels.cache
              .get("910639165392175114")
              .messages.fetch("910639655962173471")
              .then((msg) =>
                msg.edit({ embeds: [numberEmbed], content: "Roles:" })
              );
          }
        })

        interaction.deferUpdate();

        // var fs = require("fs");
        // var json = serialize(mainMessage);
        // fs.writeFile(
        //   "./exports.json",
        //   json,
        //   "utf8",
        //   function readFileCallback(err, data) {
        //     if (err) {
        //       console.log(err);
        //     }
        //   }
        // );
        // var attachments = new MessageAttachment();
        // attachments.setFile("./exports.json");
        // interaction.member.send({ files: [attachments] });
  }
  if (interaction.customId === "roleList") {
    var user = await interaction.guild.members.cache.get(interaction.user.id);
    let role = await interaction.guild.roles.cache.find(
      (r) => r.id === interaction.values[0]
    );
    await interaction.deferUpdate();
    if (!user.roles.cache.some((role) => role.id === role.id)) {
      await user.roles.add(role);

      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#15ff00")
        .setTitle("Role Added!")
        .setAuthor("Esports Bot")
        .setDescription(`Role addition in ${role.guild.name}`)
        .addField("Guild", role.guild.name, true)
        .addField("Role", role.name, true)
        .setTimestamp()
        .setFooter(user.displayName, user.displayAvatarURL({ dynamic: true }));

      user.send({ embeds: [exampleEmbed] });
    } else {
        await user.roles.remove(role);

        const exampleEmbed = new Discord.MessageEmbed()
          .setColor("#a30000")
          .setTitle("Role Removed!")
          .setAuthor("Esports Bot")
          .setDescription(`Role removal in ${role.guild.name}`)
          .addField("Guild", role.guild.name, true)
          .addField("Role", role.name, true)
          .setTimestamp()
          .setFooter(
            user.displayName,
            user.displayAvatarURL({ dynamic: true })
          );

        user.send({ embeds: [exampleEmbed] });
    }
    //console.log(interaction.values[0]);
  }
};
