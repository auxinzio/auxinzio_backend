const { ChatBotKnowledge, Faq, Product, Solution, Sequelize, Team, Service } = require('../models');
const { Op } = Sequelize;

exports.getQueryResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const searchString = `%${message}%`;

        const words = message.split(/\s+/).filter(word => word.length > 3);
        const likeConditions = words.map(word => ({ [Op.like]: `%${word}%` }));

        // 1. Check in ChatBotKnowledge
        let exactBotMatch = null;
        if (likeConditions.length > 0) {
            exactBotMatch = await ChatBotKnowledge.findOne({
                where: {
                    question: {
                        [Op.or]: likeConditions
                    },
                    status: true
                }
            });
        } else {
            exactBotMatch = await ChatBotKnowledge.findOne({
                where: {
                    question: {
                        [Op.like]: searchString
                    },
                    status: true
                }
            });
        }

        if (exactBotMatch) {
            return res.status(200).json({ answer: exactBotMatch.answer, source: 'bot' });
        }

        // 2. Check in FAQs
        let faqMatch = null;
        if (likeConditions.length > 0) {
            faqMatch = await Faq.findOne({
                where: {
                    question: {
                        [Op.or]: likeConditions
                    },
                    status: true
                }
            });
        } else {
            faqMatch = await Faq.findOne({
                where: {
                    question: {
                        [Op.like]: searchString
                    },
                    status: true
                }
            });
        }

        if (faqMatch) {
            return res.status(200).json({ answer: faqMatch.answer, source: 'faq' });
        }

        // 3. Check in Products (name or category)
        // Bug fix: when using top-level [Op.or], wrap status inside [Op.and] to avoid Sequelize conflict
        const productWhere = likeConditions.length > 0
            ? { [Op.and]: [{ [Op.or]: [{ product_name: { [Op.or]: likeConditions } }, { category_name: { [Op.or]: likeConditions } }] }, { status: true }] }
            : { [Op.and]: [{ [Op.or]: [{ product_name: { [Op.like]: searchString } }, { category_name: { [Op.like]: searchString } }] }, { status: true }] };
        const productMatch = await Product.findOne({ where: productWhere });

        if (productMatch) {
            return res.status(200).json({
                answer: `We offer a product named ${productMatch.product_name} in the ${productMatch.category_name} category. You can find more details regarding this product on our products page.`,
                source: 'product',
                data: productMatch
            });
        }

        // 4. Check in Solutions
        const solutionWhere = likeConditions.length > 0
            ? { [Op.and]: [{ [Op.or]: [{ name: { [Op.or]: likeConditions } }, { title: { [Op.or]: likeConditions } }] }, { status: true }] }
            : { [Op.and]: [{ [Op.or]: [{ name: { [Op.like]: searchString } }, { title: { [Op.like]: searchString } }] }, { status: true }] };
        const solutionMatch = await Solution.findOne({ where: solutionWhere });

        if (solutionMatch) {
            return res.status(200).json({
                answer: `We provide a solution: ${solutionMatch.title} (${solutionMatch.name}). Please check our solutions page for more details.`,
                source: 'solution',
                data: solutionMatch
            });
        }

        // 5. Check in Services
        const serviceWhere = likeConditions.length > 0
            ? { [Op.and]: [{ [Op.or]: [{ name: { [Op.or]: likeConditions } }, { title: { [Op.or]: likeConditions } }] }, { status: true }] }
            : { [Op.and]: [{ [Op.or]: [{ name: { [Op.like]: searchString } }, { title: { [Op.like]: searchString } }] }, { status: true }] };
        const serviceMatch = await Service.findOne({ where: serviceWhere });

        if (serviceMatch) {
            return res.status(200).json({
                answer: `We provide a service: ${serviceMatch.title} (${serviceMatch.name}). Please check our services page for more details.`,
                source: 'service',
                data: serviceMatch
            });
        }

        // 6. Check in Teams
        const teamWhere = likeConditions.length > 0
            ? { [Op.and]: [{ [Op.or]: [{ name: { [Op.or]: likeConditions } }, { designation: { [Op.or]: likeConditions } }] }, { status: true }] }
            : { [Op.and]: [{ [Op.or]: [{ name: { [Op.like]: searchString } }, { designation: { [Op.like]: searchString } }] }, { status: true }] };
        const teamMatches = await Team.findAll({ where: teamWhere });

        if (teamMatches.length > 0) {
            const memberList = teamMatches.map(m => `${m.name} (${m.designation})`).join(', ');
            return res.status(200).json({
                answer: `We have the following team member(s): ${memberList}. Please check our teams page for more details.`,
                source: 'team',
                data: teamMatches
            });
        }

        // Fallback response
        return res.status(200).json({
            answer: "I'm sorry, I couldn't find an exact answer to your question. Please contact our support team or leave a message.",
            source: 'fallback'
        });

    } catch (error) {
        console.error("ChatBot Error:", error);
        res.status(500).json({ error: "Internal server error while processing your request." });
    }
};

exports.getInitialState = async (req, res) => {
    try {
        // You can later make this dynamic by fetching from the database (e.g., a Settings table or a specific ChatBotKnowledge flag)
        const suggestions = [
            "What IT services does Auxinzio offer?",
            "Who are Auxinzio major clients?",
            "Tell me about Auxinzio software products.",
            "Tell me about Auxinzio team.",
            "Tell me about Auxinzio solutions.",
            "Tell me about Auxinzio careers.",
            "Tell me about Auxinzio feedbacks.",
            "Tell me about Auxinzio subscribers.",
            "Tell me about Auxinzio settings.",
            "Tell me about Auxinzio dashboard.",
            "Tell me about Auxinzio chatbot.",
        ];

        return res.status(200).json({
            greeting: "I can help you explore Auxinzio IT services, products, and business solutions.",
            suggestions: suggestions
        });
    } catch (error) {
        console.error("ChatBot Initial State Error:", error);
        res.status(500).json({ error: "Internal server error while fetching initial state." });
    }
};
