module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define('Product', {
		Name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		Description: Sequelize.DataTypes.STRING,
		Price: {
			type: Sequelize.DataTypes.DECIMAL(10,2),
			allowNull: false,
			defaultValue: 0.00
		},
		Quantity: {
			type: Sequelize.DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		DateAdded: Sequelize.DataTypes.STRING,
		imgurl: Sequelize.DataTypes.STRING,
		isDeleted: {
			type: Sequelize.DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	}, {
		timestamps: true
	});

	Product.associate = (models) => {
		Product.belongsToMany(models.User, {
			through: models.CartProducts,
			foreignKey: 'ProductId'
		});
		Product.belongsToMany(models.Order, {
			through: models.OrderProducts,
			foreignKey: 'ProductId'
		});
	};

return Product
}