const { ChatBotKnowledge, Faq, Product, Solution, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.getQueryResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Attempt to match keywords from the message
        // A simple LIKE will match if the message contains words, but typically users type full sentences
        // We can clean up the message by stripping common stop words if needed, or simply do a LIKE search.
        // Assuming the user message might contain the exact question or significant keywords
        const searchString = `%${message}%`;

        // Reverse logic: Check if any knowledge base question is contained within the user's message
        // A more advanced approach would use FULLTEXT or NLP, but basic LIKE is a start.
        // To support partial matches, let's split message into significant words (min 4 chars) and match them
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
        let productMatch = null;
        if (likeConditions.length > 0) {
            productMatch = await Product.findOne({
                where: {
                    [Op.or]: [
                        { product_name: { [Op.or]: likeConditions } },
                        { category_name: { [Op.or]: likeConditions } }
                    ],
                    status: true
                }
            });
        } else {
            productMatch = await Product.findOne({
                where: {
                    [Op.or]: [
                        { product_name: { [Op.like]: searchString } },
                        { category_name: { [Op.like]: searchString } }
                    ],
                    status: true
                }
            });
        }

        if (productMatch) {
            return res.status(200).json({
                answer: `We offer a product named ${productMatch.product_name} in the ${productMatch.category_name} category. You can find more details regarding this product on our products page.`,
                source: 'product',
                data: productMatch
            });
        }

        // 4. Check in Solutions
        let solutionMatch = null;
        if (likeConditions.length > 0) {
            solutionMatch = await Solution.findOne({
                where: {
                    [Op.or]: [
                        { name: { [Op.or]: likeConditions } },
                        { title: { [Op.or]: likeConditions } }
                    ],
                    status: true
                }
            });
        } else {
            solutionMatch = await Solution.findOne({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: searchString } },
                        { title: { [Op.like]: searchString } }
                    ],
                    status: true
                }
            });
        }

        if (solutionMatch) {
            return res.status(200).json({
                answer: `We provide a solution: ${solutionMatch.title} (${solutionMatch.name}). Please check our solutions page for more details.`,
                source: 'solution',
                data: solutionMatch
            });
        }

        // 5. Check in Services
        let serviceMatch = null;
        if (likeConditions.length > 0) {
            serviceMatch = await Service.findOne({
                where: {
                    [Op.or]: [
                        { name: { [Op.or]: likeConditions } },
                        { title: { [Op.or]: likeConditions } }
                    ],
                    status: true
                }
            });
        } else {
            serviceMatch = await Service.findOne({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: searchString } },
                        { title: { [Op.like]: searchString } }
                    ],
                    status: true
                }
            });
        }

        if (serviceMatch) {
            return res.status(200).json({
                answer: `We provide a service: ${serviceMatch.title} (${serviceMatch.name}). Please check our services page for more details.`,
                source: 'service',
                data: serviceMatch
            });
        }

        // 6. Check in Teams
        let teamMatch = null;
        if (likeConditions.length > 0) {
            teamMatch = await Team.findOne({
                where: {
                    [Op.or]: [
                        { name: { [Op.or]: likeConditions } },
                        { title: { [Op.or]: likeConditions } }
                    ],
                    status: true
                }
            });
        } else {
            teamMatch = await Team.findOne({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: searchString } },
                        { title: { [Op.like]: searchString } }
                    ],
                    status: true
                }
            });
        }

        if (teamMatch) {
            return res.status(200).json({
                answer: `We have a team member: ${teamMatch.title} (${teamMatch.name}). Please check our teams page for more details.`,
                source: 'team',
                data: teamMatch
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
