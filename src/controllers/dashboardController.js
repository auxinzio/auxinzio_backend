const { Career, Application, Team, User, Service, Product, Enquiry, Contact } = require("../models");
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
            attributes: ["applicant_name", "email", "createdAt"],
        });

        const recentEnquiries = await Enquiry.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["name", "email", "company", "createdAt"],
        });
        const recentContacts = await Contact.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["name", "email", "phone", "createdAt"],
        });

        const recentProducts = await Product.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["product_name", "logo", "createdAt"],
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
                message: `New application received: ${Application.applicant_name} - ${Application.email}`,
                time: Application.createdAt
            })),
            recentEnquiries: recentEnquiries.map(Enquiry => ({
                message: `New enquiry received from ${Enquiry.company} by ${Enquiry.name} - ${Enquiry.email}`,
                time: Enquiry.createdAt
            })),
            recentContacts: recentContacts.map(Contact => ({
                message: `New contact received : ${Contact.name}`,
                time: Contact.createdAt
            })),
            recentProducts: recentProducts.map(Product => ({
                message: Product.product_name,
                logo: Product.logo,
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