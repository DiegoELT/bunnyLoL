const { riotAPIKey } = require('./config.json');
const fetch = require('node-fetch');
const { disableValidators } = require('discord.js');

const tier = {
    'IRON': 0,
    'BRONZE': 401,
    'SILVER': 802,
    'GOLD': 1203,
    'PLATINUM': 1604,
    'DIAMOND': 2005,
    'MASTER': 2406,
    'GRANDMASTER': 2406,
    'CHALLENGER': 2406 
}

const rank = {
    'I': 300,
    'II': 200,
    'III': 100,
    'IV': 0
}

function generateUnrankedJSON(name) {
    return {
    queueType: 'RANKED_SOLO_5x5',
      tier: 'UNRANKED',
      rank: '',
      summonerName: name,
      leaguePoints: '-',
      wins: '-',
      losses: '-',
      veteran: false,
      inactive: false,
      freshBlood: false,
      hotStreak: false,
      totalElo: 0
    }
}

async function getPlayerByName(playerName, region) {
    const url = 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + playerName;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-Riot-Token": riotAPIKey
        }
    })

    if (response.status != 200) return;

    const data = await response.json();
    return data;
};

async function getPlayerLeagues(playerList, interaction) {
    const playerData = [];

    let count = 1;
    const totalPlayers = playerList.length;

    for (const player of playerList) {

        interaction.editReply('```\nSearching Player: ' + String(count) + ' of ' + String(totalPlayers) + '```');

        const url = 'https://' + player.region_id + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + player.riot_id;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Riot-Token": riotAPIKey
            }
        });
        const data = await response.json();

        if (data[0] == null) continue;

        if (data.length == 0 || (data.length == 1 && data[0].queueType === 'RANKED_FLEX_SR')) {
            playerData.push(generateUnrankedJSON(player.lol_username));
        }
        else {
            rankedData = (data[0].queueType === 'RANKED_SOLO_5x5') ? data[0] : data[1];
            rankedData.totalElo = tier[rankedData.tier] + rank[rankedData.rank] + rankedData.leaguePoints;
            playerData.push(rankedData);
        }

        count += 1;
    };

    return playerData;
}

async function getRandomChampions(numberOfChampions, listOfTags) {
	const url = 'http://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion.json';

	const response = await fetch(url, {
		method: "GET"
	});

	const data = await response.json();
	var validChampions = [];

	for (const key in data['data']) {
		let championTags = data['data'][key]['tags'];
		let championName = data['data'][key]['name'] + ', ' + data['data'][key]['title']; 


		if (listOfTags.length) {
			for (const tag of listOfTags) {
				if (championTags.includes(tag)) {
					validChampions.push(championName);
					break;
				}
			}
		}

		else 
			validChampions.push(championName);
	}

	const randomizedChampions = validChampions.sort(() => 0.5 - Math.random());

	return randomizedChampions.slice(0, numberOfChampions);
}

module.exports = { getPlayerByName, getPlayerLeagues, getRandomChampions }
