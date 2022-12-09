import requests

playersList = requests.get('https://soloqdatabase.herokuapp.com/summoners').json()

with open('bunnyChallenge.csv', 'w') as idsFile:
	idsFile.write('id,ggid\n')
	for player in playersList:
		idsFile.write(str(player['id']) + ',' + player['gg_id'] + '\n')
	
