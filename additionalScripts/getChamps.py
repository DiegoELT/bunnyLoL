import json

with open('champions.json') as championsFile: 
	championDict = json.load(championsFile)

championList = championDict['data']

with open('championsIds.csv', 'w') as csvFile:
	csvFile.write('championId,championName\n')
	for champion in championList:
		csvFile.write(str(champion['id']) + ',' + champion['name'] + '\n')

