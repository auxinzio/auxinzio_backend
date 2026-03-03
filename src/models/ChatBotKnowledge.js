"use strict";
module.exports = (sequelize, DataTypes) => {
    const ChatBotKnowledge = sequelize.define(
        "ChatBotKnowledge",
        {
            question: DataTypes.STRING,
            answer: DataTypes.TEXT,
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: "chat_bot_knowledges",
            underscored: true,
            paranoid: true,
            deletedAt: "deleted_at",
        },
    );

    return ChatBotKnowledge;
};
