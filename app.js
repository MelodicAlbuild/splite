//entry point
const Client = require('./src/Client.js');
const terminalTab = require("terminal-tab");
require('./src/utils/prototypes').arrayProto(Array)

global.__basedir = __dirname;

// Client setup
const intents = [
  "GUILDS",
  "GUILD_BANS",
  "GUILD_VOICE_STATES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS",
  "GUILD_MEMBERS",
  "GUILD_PRESENCES"
]
const client = new Client(require('./config.json'), {intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], allowedMentions: { parse: ['users', 'roles'], repliedUser: true }});

// Initialize client
function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands/commands');
  client.loadSlashCommands('./src/commands/slashCommands');
  client.loadTopics('./data/geoguessr');

  client.on('messageCreate', (message) => {
    if(message.webhookId){
      if (message.channel.id == "895474747884851240") {
        message.channel.send("Restarting due to update...");
        terminalTab.open("sh UpdateSplite.sh")
      }
    }
  })

  client.login(client.token);
}

init();

process.on('unhandledRejection', err => {client.logger.error(err); console.log(err);});