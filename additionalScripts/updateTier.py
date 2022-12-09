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

TIER = {
	None: 0,
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

RANK = {
	None: 0,
    1: 300,
    2: 200,
    3: 100,
    4: 0
}

def renew(gg_id):
	url = 'https://op.gg/api/v1.0/internal/bypass/summoners/las/' + gg_id + '/renewal'
	requests.post(url, headers = HEADERS)

def getEloTimestamp(gg_id):
	url = 'https://op.gg/api/v1.0/internal/bypass/summoners/las/' + gg_id + '?hl=en_US'
	response = requests.get(url, headers = HEADERS)
	tierInfo = response.json()['data']['league_stats'][0]['tier_info']
	
	calculatedElo = TIER[tierInfo['tier']] + RANK[tierInfo['division']]
	
	if tierInfo['lp'] != None: 
		calculatedElo += tierInfo['lp']
	
	return calculatedElo

def sendEloTimestamp(playerId, elo): 
	url = 'https://soloqdatabase.herokuapp.com/elo_timestamps' 
	body = {
		'summoner_id': playerId,
		'elo': elo
	}
	requests.post(url, json = body)

with open('bunnyChallenge.csv') as players:
	reader = csv.DictReader(players)
	listOfPlayers = [*reader]

for player in listOfPlayers:
	renew(player['ggid'])
	estimatedElo = getEloTimestamp(player['ggid'])
	sendEloTimestamp(player['id'], estimatedElo)
