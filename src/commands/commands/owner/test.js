const Command = require("../../Command.js");
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
  MessageAttachment
} = require("discord.js");

var serialize = require("serialize-javascript");
const request = require(`request`);
const fs = require("fs");

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
    // var fs = require("fs");
    //   var json = serialize(message);
    //   fs.writeFile(
    //       "./exports.json",
    //       json,
    //       "utf8",
    //       function readFileCallback(err, data) {
    //         if (err) {
    //           console.log(err);
    //         }
    //       }
    //     );
    //   var attachments = new MessageAttachment();
    //   attachments.setFile("./exports.json");
    //   message.author.send({ files: [attachments] });

    if(message.attachments.first()){
        if(message.attachments.first().name.includes(".json")){
          console.log(message.attachments.first().name);
            download(message.attachments.first().url, message.attachments.first().name);
            // var attachments2 = new MessageAttachment();
            //   attachments2.setFile("./" + message.attachments.first().name);
            //   message.author.send({ files: [attachments2] });
        }
    }

    function getCurrentFilenames() {
      console.log("\nCurrent filenames:");
      fs.readdirSync(process.cwd()).forEach(file => {
        console.log(file);
      });
      console.log("\n");
    }

    getCurrentFilenames();

    function download(url, name){
      request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream("./" + name));
    }

    const allButtons = [];

    var lJson = require("../../../../role.json");

    lJson.buttons.forEach((obj) => {
      let button = new MessageButton()
      .setCustomId(obj.roleId.toString())
      .setLabel(obj.name)
      .setStyle(obj.color);
      button.emoji = { name: obj.emoji.name, id: obj.emoji.id};
      allButtons.push(button);
      dObj = obj;
    })

    let rows = new Array(1).fill().map((r) => {
      const row = new MessageActionRow();
      allButtons.forEach((b) => {
        row.addComponents(b);
      });
      return row;
    });

    let dmembed = new MessageEmbed()
      .setTitle("Available Roles")
      .setDescription(
        "There are some roles you can check out!\nSelect from the Buttons below to pick the ones you want!"
      )
      .setColor("#08a100")
      .setFooter("Optional Discord Roles")
      .setAuthor(
        "MelodicAlbuild",
        "https://cdn.discordapp.com/avatars/392502749876584448/7d3ab8457b9509dc783f447c4a77da55.webp?size=80"
      );

      lJson.buttons.forEach((obj) => {
        dmembed.addField(
      `<:${obj.emoji.name}:${obj.emoji.id}> ${obj.name}`,
      "A New Fancy Role you can Play With! Check out the roles page so you can find out what it did.",
      true
    );

      })
    let msg = await message.channel.send({
      components: rows,
      embeds: [dmembed]
    });
    message.delete();
  }
};
