const { ChatBotKnowledge } = require('../models');
const { success, error } = require("../utils/response");

// Create a new knowledge entry
exports.create = async (req, res) => {
    try {
        const { question, answer, status } = req.body;

        if (!question || !answer) {
            return error(res, "Question and answer are required", 400);
        }

        const newKnowledge = await ChatBotKnowledge.create({
            question,
            answer,
            status: status !== undefined ? status : true
        });

        return success(res, "Knowledge Entry Created Successfully", newKnowledge, 201);
    } catch (error) {
        console.error("Create Knowledge Error:", error);
        return error(res, "Internal server error while creating knowledge Entry.", 500);
    }
};

// Get all knowledge entries
exports.list = async (req, res) => {
    try {
        const knowledgeEntries = await ChatBotKnowledge.findAll();
        return success(res, "Knowledge Entries Fetched Successfully", knowledgeEntries, 200);
    } catch (error) {
        console.error("Get Knowledge Error:", error);
        return error(res, "Internal server error while fetching knowledge entries.", 500);
    }
};

// Get a single knowledge entry by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.body;
        const knowledge = await ChatBotKnowledge.findByPk(id);

        if (!knowledge) {
            return error(res, "Knowledge Entry Not Found", 404);
        }

        return success(res, "Knowledge Entry Fetched Successfully", knowledge, 200);
    } catch (error) {
        console.error("Get Knowledge By ID Error:", error);
        return error(res, "Internal server error while fetching the knowledge entry.", 500);
    }
};

// Update a knowledge entry
exports.update = async (req, res) => {
    try {
        const { id } = req.body;
        const { question, answer, status } = req.body;

        const knowledge = await ChatBotKnowledge.findByPk(id);

        if (!knowledge) {
            return error(res, "Knowledge Entry Not Found", 404);
        }

        await knowledge.update({
            question: question !== undefined ? question : knowledge.question,
            answer: answer !== undefined ? answer : knowledge.answer,
            status: status !== undefined ? status : knowledge.status
        });

        return success(res, "Knowledge Entry Updated Successfully", knowledge, 200);
    } catch (error) {
        console.error("Update Knowledge Error:", error);
        return error(res, "Internal server error while updating the knowledge entry.", 500);
    }
};

// Delete a knowledge entry
exports.delete = async (req, res) => {
    try {
        const { id } = req.body;

        const knowledge = await ChatBotKnowledge.findByPk(id);

        if (!knowledge) {
            return error(res, "Knowledge Entry Not Found", 404);
        }

        await knowledge.destroy();

        return success(res, "Knowledge Entry Deleted Successfully", {}, 200);
    } catch (error) {
        console.error("Delete Knowledge Error:", error);
        return error(res, "Internal server error while deleting the knowledge entry.", 500);
    }
};
