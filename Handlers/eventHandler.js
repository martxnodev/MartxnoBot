async function loadEvents(client) {
  const { loadFiles } = require("../Functions/fileLoader.js");

  await client.events.clear();

  const Files = await loadFiles("Events");

  Files.forEach((file) => {
    const event = require(file);

    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);

    if (event.rest) {
      if (event.once) client.rest.once(event.name, execute);
      else client.rest.on(event.name, execute);
    } else {
      if (event.once) client.once(event.name, execute);
      else client.on(event.name, execute);
    }
  });

  return console.log("Events Loaded Successfully.");
}

module.exports = { loadEvents };
