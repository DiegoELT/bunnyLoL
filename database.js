// Require Sequelize
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'bunnyLoLDB.db',
});

require('./models/DiscordUsers')(sequelize, Sequelize.DataTypes);
require('./models/ChallengeTables')(sequelize, Sequelize.DataTypes);
require('./models/TimedChallenges')(sequelize, Sequelize.DataTypes);
require('./models/Players')(sequelize, Sequelize.DataTypes);
require('./models/ChallengeParticipants')(sequelize, Sequelize.DataTypes);
const Regions = require('./models/Regions')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const region = [
        Regions.upsert({region_id: 'br1', region_name: 'Brasil'}),
        Regions.upsert({region_id: 'eun1', region_name: 'EU Northeast'}),
        Regions.upsert({region_id: 'euw1', region_name: 'EU West'}),
        Regions.upsert({region_id: 'jp1', region_name: 'Japan'}),
        Regions.upsert({region_id: 'kr', region_name: 'Korea'}),
        Regions.upsert({region_id: 'la1', region_name: 'Latin America North'}),
        Regions.upsert({region_id: 'la2', region_name: 'Latin America South'}),
        Regions.upsert({region_id: 'na1', region_name: 'North America'}),
        Regions.upsert({region_id: 'oc1', region_name: 'Oceania'}),
        Regions.upsert({region_id: 'tr1', region_name: 'Turkey'}),
        Regions.upsert({region_id: 'ru', region_name: 'Russia'})
    ]
    await Promise.all(region);
    console.log('Database Synced');

    sequelize.close();
}).catch(console.error);