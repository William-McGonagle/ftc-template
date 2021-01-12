var Users = sequelize.define('users', {
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.TEXT
    },
    description: {
        type: Sequelize.TEXT
    },
    profilePicture: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.TEXT
    }
});

module.exports = Users;