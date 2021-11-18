const Command = require("../../Command.js");

module.exports = class SendMSGCommand extends Command {
    constructor(client) {
        super(client, {
            name: "sendmsg",
            usage: "sendmsg",
            description: `Sends a Message to someone specific`,
            type: client.types.ADMIN,
            ownerOnly: false,
        });
    }
    async run(message, args) {
        if(args[0] != null) {
            message.guild.members.fetch(args[0]).then((user) => {
	            const msg = message.content.slice(message.content.indexOf(args[1]), message.content.length);
                user.send(msg);
                message.delete();
            }).catch(console.error);
        }
    }
};
