const { Career, Application, Team, User, Service, Product } = require("../models");
const { success, error } = require("../utils/response");

exports.dashboard = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const solutions = await Service.count({ where: { status: true } });
        const products = await Product.count();

        // Mocking monthly visits as there's no tracking table yet
        const monthlyVisits = "45.2k";

        const recentApplications = await Application.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["applicant_name", "createdAt"],
        });

        const recentProducts = await Product.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["product_name", "createdAt"],
        });

        const recentCareers = await Career.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["title", "createdAt"],
        });

        // Keeping these for potential use
        const totalApplications = await Application.count();
        const totalTeam = await Team.count();
        const totalCareers = await Career.count();

        success(res, "Dashboard fetched successfully", {
            solutionsCount: solutions,
            productsCount: products,
            recentApplications: recentApplications.map(Application => ({
                message: `New application received: ${Application.applicant_name}`,
                time: Application.createdAt
            })),
            recentProducts: recentProducts.map(Product => ({
                message: Product.product_name,
                time: Product.createdAt
            })),
            recentCareers: recentCareers.map(Career => ({
                message: Career.title,
                time: Career.createdAt
            })),
            stats: {
                totalUsers,
                totalApplications,
                totalTeam,
                totalCareers,
                monthlyVisits,
            }
        });
    } catch (err) {
        error(res, err.message);
    }
};