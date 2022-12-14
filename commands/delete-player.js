const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');

const { ChallengeTables, ChallengeParticipants, Players } = require('../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_from_leaderboard')
        .setDescription('Deletes a player from an existing Leaderboard')
        .addStringOption(tableName =>
            tableName.setName('leaderboard_name')
                .setDescription('The name of your Leaderboard')
                .setRequired(true))
        .addStringOption(summonerName => 
            summonerName.setName('summoner_name')
                .setDescription('The name of the player to remove.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('```Searching for the table...```');

        const userId = interaction.user.id;
        const tableName = interaction.options.getString('leaderboard_name');
        const summonerName = interaction.options.getString('summoner_name');

        const leaderboard = await ChallengeTables.findOne({
            where: {
                discord_id: userId,
                table_name: tableName
            },
            include: {
                model: Players,
                where: {
                    lol_username: summonerName
                }
            }
        });

        //console.log(leaderboard);

        if (!leaderboard)
            return interaction.editReply('```There is no table ' + tableName + ' with such player, or you do not own a table with that name.```');

        const playerToDelete = leaderboard.players[0]
        await leaderboard.removePlayer(playerToDelete);

        const tablesLeft = await playerToDelete.countChallenge_tables();
        if (!tablesLeft)
            playerToDelete.destroy();

        return interaction.editReply('```' + summonerName + ' was succesfully deleted from ' + tableName + '.```');

    }
}