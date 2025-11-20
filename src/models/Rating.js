module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // customer who rated
      },
    },
    {
      tableName: "Ratings",
      freezeTableName: true,
      timestamps: true,
    }
  );

  Rating.associate = (models) => {
    Rating.belongsTo(models.Provider, { foreignKey: "providerId" });
    Rating.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Rating;
};
