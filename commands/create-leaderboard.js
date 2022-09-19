const { SlashCommandBuilder } = require('discord.js');

const { DiscordUsers } = require('../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_leaderboard')
        .setDescription('Creates an empty leaderboard table with a name of your choosing.')
        .addStringOption(tableName =>
            tableName.setName('table_name')
                .setDescription('The name of your table')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const tableName = interaction.options.getString('table_name');

        var user = await DiscordUsers.findOne({
            where: {
                discord_id: userId
            }
        })

        if (!user) {
            const userTag = interaction.user.tag; 
            user = await DiscordUsers.create({
                discord_id: userId,
                username: userTag
            });
        }

        const newTable = await user.addTable(tableName)

        if (newTable) {
            return interaction.reply('```Your table has been succesfully created. You can now add players to it.```');
        } 

        return interaction.reply('```There is already a table with this name owned by you. If you wish to delete use the delete_leaderboard command.```')
    }
}