module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.DataTypes.STRING,
    }, {
        timestamps: false
    });

    Category.associate = function(models) {
        Category.hasMany(models.Product, { onDelete: 'RESTRICT' });
    };

    return Category;
};