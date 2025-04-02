module.exports = (sequelize, Sequelize) => {
    const OrderStatus = sequelize.define('OrderStatus', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        OrderStatus: Sequelize.DataTypes.STRING,
    }, {
        timestamps: false
    });

    OrderStatus.associate = function(models) {
        OrderStatus.hasMany(models.Order, { onDelete: 'RESTRICT' });
    };

    return OrderStatus;
};