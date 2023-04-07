const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Revisa la latencia del WebSocketManager."),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        interaction.reply({ content: `Pong!\n\`${client.ws.ping}ms\``, ephemeral: false });
    }
}
