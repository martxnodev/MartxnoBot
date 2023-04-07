const { loadCommands } = require("../../Handlers/commandHandler.js")
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Logged on ${client.user.username}`);
    client.user.setActivity(`Trabajando en ${client.guilds.cache.size} servidores!`);
    loadCommands(client);
  },
};
