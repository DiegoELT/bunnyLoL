const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pet')
        .setDescription('Pets the Bunny that controls the bot!'),
    async execute(interaction) {
        await interaction.reply('```The bunny appreciates your pets.```');
    }
}