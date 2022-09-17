module.exports = (sequelize, DataTypes) => { 
    return sequelize.define('players', {
        riot_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        region_id: DataTypes.STRING,
        lol_username: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
	}, {
		timestamps: false,
    });
};