const { SlashCommandBuilder } = require('discord.js');
const { getRandomChampions } = require('../apiFunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_champions')
		.setDescription('Get a list of random champions based on a list of Tags')
		.addIntegerOption(championAmount => 
			championAmount.setName('champion_amount')
				.setDescription('Amount of champions to be generated')
				.setRequired(false))
		.addStringOption(listOfTags =>
			listOfTags.setName('list_of_tags')
				.setDescription('Your list of champion tags, separated by commas.')
				.setRequired(false)),

	async execute(interaction) {
		const userTag = interaction.user.tag; 
		const championAmount = interaction.options.getInteger('champion_amount');
		const stringOfTags = interaction.options.getString('list_of_tags')
	
		const validTags = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support']; 

		var numberOfChampions = 1;
		var listOfTags = [];

		await interaction.reply('```Generating Champions...```');
		
		if (stringOfTags) {
			listOfTags = stringOfTags.split(',');
			listOfTags.forEach((tag, index) => {
				listOfTags[index] = tag.replace(/\s/g, '');
				listOfTags[index] = listOfTags[index].charAt(0).toUpperCase() + listOfTags[index].slice(1);
			});
		}	

		for (const tag of listOfTags) {
			if (!validTags.includes(tag)) 
				return interaction.editReply('```One or more tags were written incorrectly. The list of valid tags is:\n\n[Tank, Fighter, Assassin, Mage, Marksman, Support]```');
		}

		if (championAmount)
			numberOfChampions = championAmount;

		const champsSelected = await getRandomChampions(numberOfChampions, listOfTags);

		let replyMessage = '```asciidoc\n' + userTag.substr(0, userTag.indexOf('#')) + ', your champions are:\n';

		for (const champ of champsSelected) 
			replyMessage += '- ' + champ + '\n';
		
		replyMessage += '```';

		return interaction.editReply(replyMessage);
	}
}
