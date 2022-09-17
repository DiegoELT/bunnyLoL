const { SlashCommandBuilder } = require('discord.js');
const { getPlayerByName } = require('../apiFunctions');
const { Players, ChallengeTables } = require('../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_player')
        .setDescription('Add a player to an already existing table')
        .addStringOption(tableName =>
            tableName.setName('table_name')
                .setDescription('The name of your table')
                .setRequired(true))
        .addStringOption(playerName =>
            playerName.setName('player_name')
            .setDescription('The name of your table')
            .setRequired(true))
        .addStringOption(region =>
            region.setName('region')
            .setDescription('The name of your table')
            .setRequired(true)
            .addChoices( // This in the future should be done with an array.
                {name: 'Brasil', value: 'br1'},
                {name: 'EU Northeast', value: 'eun1'},
                {name: 'EU West', value: 'euw1'},
                {name: 'Japan', value: 'jp1'},
                {name: 'Korea', value: 'kr'},
                {name: 'Latin America North', value: 'la1'},
                {name: 'Latin America South', value: 'la2'},
                {name: 'North America', value: 'na1'},
                {name: 'Oceania', value: 'oc1'},
                {name: 'Turkey', value: 'tr1'},
                {name: 'Russia', value: 'ru'}
            )),
    async execute(interaction) {
        const userId = interaction.user.id;
        const tableName = interaction.options.getString('table_name');
        const playerName = interaction.options.getString('player_name');
        const region = interaction.options.getString('region')

        const table = await ChallengeTables.findOne({
            where: {
                discord_id: userId,
                table_name: tableName
            }
        })

        if (table) {
            const player = await getPlayerByName(playerName, region);

            if (player) {
                var playerToAdd = await Players.findOne({
                    where: {
                        riot_id: player.id
                    }
                });
                if (!playerToAdd) {
                    playerToAdd = await Players.create({
                        riot_id: player.id,
                        region_id: region,
                        lol_username: player.name
                    })
                }

                await table.addPlayers(playerToAdd);
                return interaction.reply('Succesfully added the player ' + playerName + ' to the leaderboard.');
            }

            return interaction.reply('There are no players named `' + playerName + '` in that region.');
        } 

        return interaction.reply('You have no tables named `' + tableName + '`. Make sure to create it with `create_table`');
    }
}