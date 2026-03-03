const { Enquiry, Product } = require("../models");
const { success, error } = require("../utils/response");

exports.list = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 2 } = req.body;
    const where = {};
    if (status !== undefined) {
      where.status = status;
    }
    if (search) {
      where.name = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Enquiry.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"],
        },
      ],
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    const enquiresData = rows.map((enquires) => {
      const item = enquires.toJSON();
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.company,
        object: item.object,
        product_id: item.product_id,
        product_name: item.product?.product_name || null,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deleted_at: item.deleted_at,
      };
    });
    success(res, "Enquires Fetched Successfully", {
      totalCount: count,
      enquiresList: enquiresData,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const enquires = await Enquiry.findByPk(req.body.id);

    // const enquiresData = await Enquiry.findAll({
    //   where: { id: req.body.id },
    //   include: [
    //     {
    //       model: Product,
    //       as: "product",
    //       attributes: ["product_name"],
    //     },
    //   ],
    // });
    // const enquires = enquiresData?.map((enquires) => {
    //   const item = enquires.toJSON();
    //   return {
    //     id: item.id,
    //     name: item.name,
    //     email: item.email,
    //     phone: item.phone,
    //     company: item.company,
    //     object: item.object,
    //     product_id: item.product_id,
    //     product_name: item.product?.product_name || null,
    //     status: item.status,
    //     createdAt: item.createdAt,
    //     updatedAt: item.updatedAt,
    //     deleted_at: item.deleted_at,
    //   };
    // });
    if (!enquires) return error(res, "Enquires Not Found", 404);
    success(res, "Enquires Fetched Successfully", { enquires });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const enquires = await Enquiry.create(data);
    const enquiresData = {
      id: enquires.id,
      name: enquires.name,
      email: enquires.email,
      phone: enquires.phone,
      company: enquires.company,
      object: enquires.object,
      product_id: enquires.product_id,
      product_name: enquires.product?.product_name || null,
      status: enquires.status,
      createdAt: enquires.createdAt,
      updatedAt: enquires.updatedAt,
      deleted_at: enquires.deleted_at,
    };
    success(res, "Enquires Created Successfully", { enquiresData }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const enquires = await Enquiry.findByPk(req.body.id);
    if (!enquires) return error(res, "Enquires Not Found", 404);
    await enquires.update(data);
    success(res, "Enquires Updated Successfully", { enquires });
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const enquires = await Enquiry.findByPk(req.body.id);
    if (!enquires) return error(res, "Enquires Not Found", 404);
    await enquires.update(data);
    success(res, "Enquires Status Updated Successfully", { enquires });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const enquires = await Enquiry.findByPk(req.body.id);
    if (!enquires) return error(res, "Enquires Not Found", 404);
    await enquires.destroy();
    success(res, "Enquires Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};

// Web application
exports.submit = async (req, res) => {
  try {
    const data = req.body;
    const enquires = await Enquiry.create(data);
    const enquiresData = {
      id: enquires.id,
      name: enquires.name,
      email: enquires.email,
      phone: enquires.phone,
      company: enquires.company,
      object: enquires.object,
      product_id: enquires.product_id,
      product_name: enquires.product?.product_name || null,
      status: enquires.status,
      createdAt: enquires.createdAt,
      updatedAt: enquires.updatedAt,
      deleted_at: enquires.deleted_at,
    };
    success(res, "Enquires Submitted Successfully", { enquiresData });
  } catch (err) {
    error(res, err.message);
  }
};
