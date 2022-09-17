module.exports = (sequelize, DataTypes) => { 
    return sequelize.define('challenge_tables', {
        table_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        discord_id: DataTypes.STRING,
        table_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_of_creation: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_challenge: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
		timestamps: false,
	});
};