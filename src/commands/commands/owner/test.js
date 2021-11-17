const Command = require("../../Command.js");
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
  MessageAttachment
} = require("discord.js");

var serialize = require("serialize-javascript");
const request = require(`request`);

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
    var fs = require("fs");
      var json = serialize(message);
      fs.writeFile(
          "./exports.json",
          json,
          "utf8",
          function readFileCallback(err, data) {
            if (err) {
              console.log(err);
            }
          }
        );
      var attachments = new MessageAttachment();
      attachments.setFile("./exports.json");
      message.author.send({ files: [attachments] });

    var fileName = "";

    if(message.attachments.first()){
        if(message.attachments.first().name.includes(".json")){
            download(message.attachments.first().url, message.attachments.first().name);
            var attachments2 = new MessageAttachment();
              attachments2.setFile("./" + message.attachments.first().name);
              message.author.send({ files: [attachments2] });
              fileName = "./" + message.attachments.first().name;
        }
    }

    async function download(url, name){
      await request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(name));
    }

    const allButtons = [];

    var lJson = require(fileName);

    lJson.buttons.forEach((obj) => {
      let button = new MessageButton()
      .setCustomId(obj.roleId)
      .setLabel(obj.name)
      .setStyle(obj.color);
      button.emoji = { name: obj.emoji.name, id: obj.emoji.id};
      allButtons.push(button);
    })

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

    let rows = new Array(1).fill().map((r) => {
      const row = new MessageActionRow();
      allButtons.forEach((b) => {
        row.addComponents(b);
      });
      return row;
    });

    let dmembed = new MessageEmbed()
      .setTitle("Newly Available Roles")
      .setDescription(
        "There are some new roles you can check out!\nSelect from the Buttons below to pick the ones you want!"
      )
      .setColor("#08a100")
      .setFooter("New Optional Discord Roles")
      .addField(
        "<:grassblock:903101079300997181> Minecraft",
        "We are taking community interest in a Minecraft Team, If you are interested indicate that by selecting this role.",
        true
      )
      .addField(
        "<:nfl:903102675191742494> Madden",
        "We are taking community interest in a Madden Team, If you are interested indicate that by selecting this role.",
        true
      )
      .setAuthor(
        "MelodicAlbuild",
        "https://cdn.discordapp.com/avatars/392502749876584448/7d3ab8457b9509dc783f447c4a77da55.webp?size=80"
      );

    let msg = await message.channel.send({
      components: rows,
      embeds: [dmembed]
    });
    message.delete();
  }
};
