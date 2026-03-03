const { ChatBotKnowledge } = require('../models');
const { success, error } = require("../utils/response");
// Create a new knowledge entry
exports.create = async (req, res) => {
    try {
        const { question, answer, status } = req.body;
        if (!question || !answer) {
            error(res, "Question and answer are required", 400);
        }
        const chat = await ChatBotKnowledge.create({
            question,
            answer,
            status: status !== undefined ? status : true
        });
        success(res, "Chatbot Knowledge Created Successfully", { chat }, 201);
    } catch (err) {
        console.error("Create Chatbot Knowledge Error:", err);
        error(res, err.message);
    }
};
exports.list = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 2 } = req.body;
        const where = {};
        if (status !== undefined) {
            where.status = status;
        }
        if (search) {
            where.question = {
                [require("sequelize").Op.like]: `%${search}%`,
            };
        }
        const offset = (page - 1) * limit;
        const { rows, count } = await ChatBotKnowledge.findAndCountAll({
            where,
            order: [["id", "DESC"]],
            limit: parseInt(limit),
            offset,
        });
        success(res, "Chatbot Knowledge Entries Fetched Successfully", {
            totalCount: count,
            chatList: rows,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        console.error("Get Chatbot Knowledge Error:", err);
        error(res, err.message);
    }
};
// Get a single knowledge entry by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.body;
        const chat = await ChatBotKnowledge.findByPk(id);
        if (!chat) {
            error(res, "Chatbot Knowledge Not Found", 404);
        }
        success(res, "Chatbot Knowledge Fetched Successfully", { chat }, 200);
    } catch (err) {
        console.error("Get Chatbot Knowledge By ID Error:", err);
        error(res, err.message);
    }
};
// Update a knowledge entry
exports.update = async (req, res) => {
    try {
        const { id } = req.body;
        const { question, answer, status } = req.body;
        const chat = await ChatBotKnowledge.findByPk(id);
        if (!chat) {
            error(res, "Chatbot Knowledge Not Found", 404);
        }
        await chat.update({
            question: question !== undefined ? question : chat.question,
            answer: answer !== undefined ? answer : chat.answer,
            status: status !== undefined ? status : chat.status
        });
        success(res, "Chatbot Knowledge Updated Successfully", { chat }, 200);
    } catch (err) {
        console.error("Update Chatbot Knowledge Error:", err);
        error(res, err.message);
    }
};
// Delete a knowledge entry
exports.delete = async (req, res) => {
    try {
        const { id } = req.body;
        const chat = await ChatBotKnowledge.findByPk(id);
        if (!chat) {
            error(res, "Chatbot Knowledge Not Found", 404);
        }
        await chat.destroy();
        success(res, "Chatbot Knowledge Deleted Successfully", {}, 200);
    } catch (err) {
        console.error("Delete Chatbot Knowledge Error:", err);
        error(res, err.message);
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const data = req.body;
        const chat = await ChatBotKnowledge.findByPk(req.body.id);
        if (!chat) return error(res, "Chatbot Knowledge Not Found", 404);
        await chat.update(data);
        success(res, "Chatbot Knowledge Status Updated Successfully", { chat });
    } catch (err) {
        error(res, err.message);
    }
};