const { AsciiTable3 } = require('ascii-table3')
const { SlashCommandBuilder } = require('discord.js');

const { DiscordUsers, ChallengeTables } = require('../dbObjects');

const customStyle = require('../custom-styles.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my_leaderboards')
        .setDescription('Shows a table with all the Leaderboards that you own.'),
    
    async execute(interaction) { 
        await interaction.reply('```Searching for your Leaderboards...```');

        const userId = interaction.user.id;

        const leaderboards = await ChallengeTables.findAll({
            where: {
                discord_id: userId
            },
            include: {
                model: DiscordUsers
            }
        })

        if (!leaderboards.length)
            return interaction.editReply('```You do not own any Leaderboards.```')

        const leaderboardsTable = new AsciiTable3(interaction.user.tag + "'s Tables");
        leaderboardsTable.setHeading('Table Name', 'No. of Players', 'Date of Creation');

        for (let i = 0; i < leaderboards.length; i++) {
            const leaderboard = leaderboards[i];
            leaderboardsTable.addRow(
                leaderboard.table_name,
                await leaderboard.countPlayers(),
                leaderboard.date_of_creation
            )
        }

        leaderboardsTable.addStyle(customStyle[0]);
        leaderboardsTable.setStyle("colored");

        return interaction.editReply('```md\n' + leaderboardsTable.toString() + '```');
    }
}