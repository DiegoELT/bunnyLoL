const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'bunnyLoLDB.db',
});

const DiscordUsers = require('./models/DiscordUsers')(sequelize, Sequelize.DataTypes);
const ChallengeTables = require('./models/ChallengeTables')(sequelize, Sequelize.DataTypes);
const TimedChallenges = require('./models/TimedChallenges')(sequelize, Sequelize.DataTypes);
const Players = require('./models/Players')(sequelize, Sequelize.DataTypes);
const Regions = require('./models/Regions')(sequelize, Sequelize.DataTypes);
const ChallengeParticipants = require('./models/ChallengeParticipants')(sequelize, Sequelize.DataTypes);

// Belongs To Properties
DiscordUsers.hasMany(ChallengeTables, {
    foreignKey: 'discord_id'
});
ChallengeTables.belongsTo(DiscordUsers, {
    foreignKey: 'discord_id'
});

ChallengeTables.hasOne(TimedChallenges, {
    foreignKey: 'table_id'
});
TimedChallenges.belongsTo(ChallengeTables, { 
    foreignKey: 'table_id'
});

ChallengeTables.belongsToMany(Players, {
    through: ChallengeParticipants,
    foreignKey: 'table_id'
});
Players.belongsToMany(ChallengeTables, {
    through: ChallengeParticipants,
    foreignKey: 'riot_id'
});

Players.hasOne(Regions, {
    foreignKey: 'region_id'
});
Regions.belongsTo(Players, {
    foreignKey: 'region_id'
});

Reflect.defineProperty(DiscordUsers.prototype, 'addTable', {
    value: async function addItem(tableName) {
        const table = await ChallengeTables.findOne({
            where: {
                discord_id: this.discord_id,
                table_name: tableName
            },
        });

        if (table) {
            return false;
        } else {
            var today  = new Date();

            return ChallengeTables.create({
                discord_id: this.discord_id,
                table_name: tableName,
                date_of_creation: today.toLocaleString("en-US"),
            });
        }
    }
});

module.exports = { DiscordUsers, ChallengeTables, TimedChallenges, Players, Regions, ChallengeParticipants }