const { SlashCommandBuilder } = require('discord.js');

const { ChallengeTables, ChallengeParticipants } = require('../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_leaderboard')
        .setDescription('Deletes your Leaderboard. Be careful.')
        .addStringOption(leaderboardName =>
            leaderboardName.setName('leaderboard_name')
                .setDescription('The name of your Leaderboard')
                .setRequired(true)),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const leaderboardName = interaction.options.getString('leaderboard_name');

        await interaction.reply('```Searching for the table.```')

        const leaderboard = await ChallengeTables.findOne({
            where: {
                discord_id: userId,
                table_name: leaderboardName
            }
        });

        if (leaderboard) {
            await interaction.editReply('```Table Found. Deleting...```')

            ChallengeParticipants.destroy({
                where: {
                    table_id: leaderboard.table_id
                }
            })
            leaderboard.destroy();
            
            return interaction.editReply('```The table has been deleted.```')
        } else {
            return interaction.editReply('```You do not own a table named ' + leaderboardName + '.```')
        }
    }
}