module.exports = (sequelize, DataTypes) => {
    const OrderProducts = sequelize.define('OrderProducts', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      CapturedPricePerItem: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
      },
      }, { timestamps: false });
  
    return OrderProducts;
  };