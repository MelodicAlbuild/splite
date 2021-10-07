const Command = require('../../Command.js');

module.exports = class ShutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            aliases: ['sd'],
            usage: 'shutdown',
            description: `Shuts down ${client.name}`,
            type: client.types.OWNER,
            ownerOnly: true
        });
    }
    run(message, args) {
        message.channel.send("Shutting down...").then(() => {
            // Kill Node Process
            process.exit();
        })
    }
};
