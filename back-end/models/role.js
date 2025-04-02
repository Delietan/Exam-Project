module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Role: Sequelize.DataTypes.STRING,
    }, {
        timestamps: false
    });

    Role.associate = function(models) {
        Role.hasMany(models.User, { onDelete: 'RESTRICT' });
    };

    return Role;
};