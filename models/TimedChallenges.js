module.exports = (sequelize, DataTypes) => { 
    return sequelize.define('timed_challenges', {
        table_id: DataTypes.UUID,
        finish_date: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
		timestamps: false,
	});
};