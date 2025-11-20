const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const db = {};

db.sequelize = sequelize;
db.User = require('./User')(sequelize, DataTypes);
db.Provider = require('./Provider')(sequelize, DataTypes);
db.Service = require("./Service")(sequelize, DataTypes)

db.User.hasOne(db.Provider, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Provider.belongsTo(db.User, { foreignKey: 'userId' });

db.Provider.hasMany(db.Service, { as: "services", foreignKey: "providerId" })
db.Service.belongsTo(db.Provider, { foreignKey: "providerId" })

db.Rating = require("./Rating")(sequelize, DataTypes);

db.Provider.hasMany(db.Rating, { foreignKey: "providerId" });
db.Rating.belongsTo(db.Provider, { foreignKey: "providerId" });

db.User.hasMany(db.Rating, { foreignKey: "userId" });
db.Rating.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;