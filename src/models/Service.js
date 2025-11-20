// src/models/Service.js
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      availableDays: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locationRadius: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      providerId: {
        type: DataTypes.INTEGER,
        field: "providerId", // exact column name in PostgreSQL
      },
    },
    {
      tableName: "Services",  // EXACT name
      freezeTableName: true,
      timestamps: true,
    }
  );

  Service.associate = (models) => {
    Service.belongsTo(models.Provider, {
      foreignKey: "providerId",
    });
  };

  return Service;
};
