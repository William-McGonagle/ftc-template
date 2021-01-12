var Journals = sequelize.define('journals', {
    journalTitle: {
        type: Sequelize.STRING
    },
    journalBody: {
        type: Sequelize.TEXT
    },
    journalPublic: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = Journals;