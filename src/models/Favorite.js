// src/models/Favorite.js
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      tableName: "Favorites",
      freezeTableName: true,
      timestamps: true,
      indexes: [
        // unique index to prevent duplicate favorites
        {
          unique: true,
          fields: ["userId", "providerId"],
          where: { providerId: { [sequelize.Sequelize.Op.ne]: null } },
          name: "uniq_user_provider"
        },
        {
          unique: true,
          fields: ["userId", "serviceId"],
          where: { serviceId: { [sequelize.Sequelize.Op.ne]: null } },
          name: "uniq_user_service"
        }
      ]
    }
  );

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { foreignKey: "userId" });
    Favorite.belongsTo(models.Provider, { foreignKey: "providerId" });
    Favorite.belongsTo(models.Service, { foreignKey: "serviceId" });
  };

  return Favorite;
};
