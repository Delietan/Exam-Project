module.exports = (sequelize, Sequelize) => {
    const CartProducts = sequelize.define('CartProducts', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        ProductId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        quantity: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        timestamps: false
    });

    // CartProducts.associate = function(models) {
    //     CartProducts.belongsTo(models.User, { foreignKey: 'UserId', onDelete: 'CASCADE' });
    
    //     CartProducts.belongsTo(models.Product, { foreignKey: 'ProductId', onDelete: 'CASCADE' });
    // };

    return CartProducts;
};
