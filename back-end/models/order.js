module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uniqueId: {
            type: Sequelize.DataTypes.STRING(8),
            allowNull: false,
            unique: true,
            defaultValue: sequelize.literal("(LEFT(UUID(), 8))")
        },
        capturedMembershipId: {
            type: Sequelize.DataTypes.INTEGER
        },
        capturedMembershipName: {
            type: Sequelize.DataTypes.STRING
        },
        capturedMembershipDiscount: {
            type: Sequelize.DataTypes.STRING
        },
    }, {
        timestamps: true
    });

    Order.associate = (models) => {
        Order.belongsTo(models.OrderStatus, { onDelete: 'RESTRICT' });
		Order.belongsToMany(models.Product, {
		  through: models.OrderProducts,
		  foreignKey: 'OrderId'
		});
	};

    return Order;
};