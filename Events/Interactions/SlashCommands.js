const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param { ChatInputCommandInteraction } interaction 
     */
    execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName)
        if(!command) 
        return interaction.reply({ 
            content: ":x: | Este comando no esta disponible o no existe.", 
            ephemeral: true
        });

        if(command.developer && interaction.user.id !== process.env.owners)
        return interaction.reply({ 
        content: ":x: | Este comando esta solo disponible para mis creadores", 
        ephemeral: true
    });

    command.execute(interaction, client)
    }
}