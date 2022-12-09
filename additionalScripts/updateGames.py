import requests
import csv

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}

with open('championsIds.csv') as champions:
	reader = csv.DictReader(champions)
	dictOfChampions = dict()
	for champion in [*reader]:
		dictOfChampions[int(champion['championId'])] = champion['championName']

def renew(gg_id):
	url = 'https://op.gg/api/v1.0/internal/bypass/summoners/las/' + gg_id + '/renewal'
	requests.post(url, headers = HEADERS)

def getPlayerGameStats(gg_id, gameParticipants):
	stats = dict()
	for participant in gameParticipants:
		if participant['summoner']['summoner_id'] == gg_id:
			gameStats = participant['stats']
			stats['kills'] = gameStats['kill']
			stats['deaths'] = gameStats['death']
			stats['assist'] = gameStats['assist']
			stats['gold'] = gameStats['gold_earned']
			stats['damage'] = gameStats['total_damage_dealt_to_champions']
			stats['score'] = gameStats['op_score']
			stats['won'] = gameStats['result'] == 'WIN'
			stats['champ'] = dictOfChampions[participant['champion_id']]
			stats['role'] = participant['position']
	return stats

def getGames(gg_id):
	url = 'https://op.gg/api/v1.0/internal/bypass/games/las/summoners/' + gg_id + '?&limit=10&hl=en_US&game_type=soloranked'
	response = requests.get(url, headers = HEADERS)
	games = response.json()['data']

	listOfGames = []

	for game in games:
		if not game['is_remake']:
			gameData = getPlayerGameStats(gg_id, game['participants'])
			gameData['game_id'] = game['id'] 
			gameData['duration_seconds'] = game['game_length_second']
			listOfGames.append(gameData)

	return listOfGames

def sendGame(gameData):
	url = 'https://soloqdatabase.herokuapp.com/games'
	body = gameData
	requests.post(url, json = body)

with open('bunnyChallenge.csv') as players:
	reader = csv.DictReader(players)
	listOfPlayers = [*reader]

for player in listOfPlayers:
	renew(player['ggid'])
	gamesPlayed = getGames(player['ggid'])
	for game in gamesPlayed:
		game['summoner_id'] = int(player['id'])
		sendGame(game)
