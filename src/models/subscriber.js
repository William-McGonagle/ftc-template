var Subscriber = sequelize.define('subscriber', {
    email: {
        type: Sequelize.TEXT
    },
    emailGroup: {
        type: Sequelize.STRING
    }
});

module.exports = Subscriber;