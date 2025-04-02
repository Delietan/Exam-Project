module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('User', {
		id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		Username: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true
		},
		EncryptedPassword: {
				// type: Sequelize.DataTypes.BLOB,
				type: Sequelize.DataTypes.STRING,
				allowNull: false
		},
		Salt: {
				// type: Sequelize.DataTypes.BLOB,
				type: Sequelize.DataTypes.STRING,
				allowNull: false
		},
		Email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true
		},
		FirstName: Sequelize.DataTypes.STRING,
		LastName: Sequelize.DataTypes.STRING,
		Address: Sequelize.DataTypes.STRING,
		Telephone: Sequelize.DataTypes.STRING,
		MembershipId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
		RoleId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2
        }
	
	});

	User.associate = function(models) {
		User.hasMany(models.Order, { onDelete: 'RESTRICT' });
		User.belongsToMany(models.Product, {
			through: models.CartProducts,
			foreignKey: 'UserId'
		});
    };

return User
}