const { SlashCommandBuilder } = require('discord.js');
const { AsciiTable3 } = require('ascii-table3')

const customStyle = require('../custom-styles.json')

const { getPlayerLeagues } = require('../apiFunctions');
const { ChallengeTables, DiscordUsers } = require('../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show_leaderboard')
        .setDescription('Shows your Leaderboard with that name. You can add a user if it is not yours.')
        .addStringOption(leaderboardName =>
            leaderboardName.setName('leaderboard_name')
                .setDescription('The name of your Leaderboard')
                .setRequired(true))
        .addStringOption(leaderboardOwner =>
            leaderboardOwner.setName('owner_name')
                .setDescription('The creator of the Leaderboard')
                .setRequired(false)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const leaderboardName = interaction.options.getString('leaderboard_name');
        const leaderboardOwner = interaction.options.getString('owner_name');

        let ownerId;

        if (leaderboardOwner) {
            const owner = await DiscordUsers.findOne({
                where: {
                    username: leaderboardOwner
                }
            });

            if (!owner)
                return interaction.reply('There is no table named `' + leaderboardName + '` for user `' + leaderboardOwner +'`.');

            ownerId = owner.discord_id;
        } else {
            ownerId = userId;
        }

        const leaderboard = await ChallengeTables.findOne({
            where: {
                discord_id: ownerId,
                table_name: leaderboardName
            }
        });

        if (!leaderboard) 
            return interaction.reply('There is no table named `' + leaderboardName + '` for that user.');

        await interaction.reply('Calculating');
        
        const players = await leaderboard.getPlayers(); 

        const playerData = await getPlayerLeagues(players, interaction);

        playerData.sort(function (a,b) {
            return b.totalElo - a.totalElo;
        })

        const leaderTable = new AsciiTable3(leaderboard.table_name);
        leaderTable.setHeading('', 'Summoner', 'Wins', 'Losses', 'Rank', 'LP');

        const rows = []

        for (let i = 0; i < playerData.length; i++) {
            const player = playerData[i];
            leaderTable.addRow(
                String(i + 1) + '.',
                player.summonerName,
                player.wins,
                player.losses,
                player.tier.charAt(0) + player.tier.slice(1).toLowerCase() + ' ' + player.rank,
                player.leaguePoints
            )
        }

        leaderTable.addStyle(customStyle[0]);
        leaderTable.setStyle("colored");

        return interaction.editReply('```md\n' + leaderTable.toString() + '```');
    }
}