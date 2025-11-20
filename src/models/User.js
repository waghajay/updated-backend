const { DataTypes } = require("sequelize");
const { default: isEmail } = require("validator/lib/isEmail");

module.exports = (sequelize , DataTypes) => {
    const User = sequelize.define("User" , {
        name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type : DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {isEmail: true}
        },
        password: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('customer','provider','admin'),
            defaultValue: 'customer',
        }
    },{
        timestamps: true,
    })


    return User;
}