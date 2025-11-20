module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // customer who booked
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "completed"),
        defaultValue: "pending",
      }
    },
    {
      tableName: "Bookings",
      freezeTableName: true,
      timestamps: true,
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: "userId" });
    Booking.belongsTo(models.Provider, { foreignKey: "providerId" });
    Booking.belongsTo(models.Service, { foreignKey: "serviceId" });
  };

  return Booking;
};
