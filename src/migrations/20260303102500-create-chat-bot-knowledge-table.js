'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('chat_bot_knowledges', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            question: {
                type: Sequelize.STRING,
                allowNull: false
            },
            answer: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('chat_bot_knowledges');
    }
};
