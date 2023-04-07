async function loadCommands(client) {
  const { loadFiles } = require("../Functions/fileLoader.js");

  await client.commands.clear();

  let commandsArray = [];

  const Files = await loadFiles("Commands");

  Files.forEach((file) => {
    const command = require(file);
    client.commands.set(command.data.name, command);

    commandsArray.push(command.data.toJSON());
  });

  client.application.commands.set(commandsArray);

  return console.log("Commands Loaded Successfully.");
}

module.exports = { loadCommands };