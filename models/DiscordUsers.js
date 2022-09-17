module.exports = (sequelize, DataTypes) => {
    return sequelize.define('discord_users', {
        discord_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
    }, {
        timestamps: false
    });
}