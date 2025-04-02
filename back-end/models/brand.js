module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define('Brand', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.DataTypes.STRING,
    }, {
        timestamps: false
    });

    Brand.associate = function(models) {
        Brand.hasMany(models.Product, { onDelete: 'RESTRICT' });
    };

    return Brand;
};