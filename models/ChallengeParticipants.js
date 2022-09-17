module.exports = (sequelize, DataTypes) => { 
    return sequelize.define('challenge_participants', {
        table_id: DataTypes.UUID,
        riot_id: DataTypes.STRING
    }, {
		timestamps: false,
    });
};