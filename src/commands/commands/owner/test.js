const Command = require('../../Command.js');

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            usage: 'test',
            description: `Functioning Test Command`,
            type: client.types.OWNER,
            ownerOnly: true
        });
    }
    run(message, args) {
        const emojiList = message.guild.emojis.cache.map((e, x) => (e.name + ' = ' + e) + ' | ' + x).join('\n');
        message.channel.send(emojiList);
    }
};
