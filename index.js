const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler.js");

require("dotenv").config();
client.commands = new Collection();
client.events = new Collection();
client.color = process.env.color;

const { connect } = require("mongoose");
connect(process.env.DatabaseURL, {}).then(() =>
  console.log("Connected to mongoDB succesfully")
);

loadEvents(client);

client.login(process.env.TOKEN);
