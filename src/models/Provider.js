// src/models/Provider.js
const categories = [
  "Cook",
  "Electrician",
  "House maid",
  "Gardener",
  "Cleaner",
  "Pet Care",
  "Driver",
];

module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define(
    "Provider",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(...categories),
        allowNull: false,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      salaryRange: DataTypes.STRING,
      availabilityType: DataTypes.ENUM("daily", "monthly", "emergency"),
      workType: DataTypes.ENUM("daily", "monthly"),
      gpsRadius: DataTypes.INTEGER,
      skills: DataTypes.TEXT,
      overview: DataTypes.TEXT,
      emergencyAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      idProof: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        field: "userId", // EXACT match to PostgreSQL
      },
    },
    {
      tableName: "Providers",   // EXACT DB table name
      freezeTableName: true,    // do NOT pluralize or lowercase
      timestamps: true,
    }
  );

  Provider.associate = (models) => {
    Provider.hasMany(models.Service, {
      foreignKey: "providerId",
    });
  };

  return Provider;
};
