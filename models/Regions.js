module.exports = (sequelize, DataTypes) => { 
    return sequelize.define('regions', {
        region_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        region_name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
	}, {
		timestamps: false,
    });
};