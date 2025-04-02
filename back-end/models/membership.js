module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: Sequelize.DataTypes.STRING,
        Discount: Sequelize.DataTypes.STRING,
        Threshold: Sequelize.DataTypes.INTEGER,
    }, {
        timestamps: true
    });

    Membership.associate = function(models) {
        Membership.hasMany(models.User, { onDelete: 'RESTRICT' });
    };

    return Membership;
};