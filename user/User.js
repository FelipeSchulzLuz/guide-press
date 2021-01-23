const { Sequelize } = require('sequelize')
const connection = require("../database/database")


const User = connection.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    repassword: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
    }
})


User.sync({force:true})

module.exports = User;