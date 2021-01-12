var JournalTags = sequelize.define('journalTag', {
    tagName: {
        type: Sequelize.STRING
    }
});

module.exports = JournalTags;