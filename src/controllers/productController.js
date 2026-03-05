const { Product, Faq } = require("../models");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { success, error } = require("../utils/response");

const deleteImg = (folder, img) => {
  if (!img) return;
  const p = path.join(__dirname, "..", "uploads", folder, img);
  if (fs.existsSync(p)) fs.unlinkSync(p);
};
exports.create = async (req, res) => {
  try {
    const data = req.body;
    // data.slug = slugify(data.product_name, { lower: true });
    data.slug = data.product_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    ["tag", "key_feature", "benefit"].forEach((f) => {
      if (data[f] && typeof data[f] === "string") {
        data[f] = JSON.parse(data[f]);
      }
    });
    if (req.files?.image)
      data.image = `uploads/products/${req.files.image[0].filename}`;
    if (req.files?.logo)
      data.logo = `uploads/products/${req.files.logo[0].filename}`;
    const product = await Product.create(data);
    success(res, "Product Created Successfully", { product }, 201);
  } catch (err) {
    error(res, err.message);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;
    const product = await Product.findByPk(id);
    if (!product) return error(res, "Product Not Found", 404);
    if (data.product_name)
      data.slug = data.product_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    ["tag", "key_feature", "benefit"].forEach((f) => {
      if (data[f] && typeof data[f] === "string") {
        data[f] = JSON.parse(data[f]);
      }
    });
    if (req.files?.image) {
      deleteImg("product", product.image);
      data.image = `uploads/products/${req.files.image[0].filename}`;
    }
    if (req.files?.logo) {
      deleteImg("product", product.logo);
      data.logo = `uploads/products/${req.files.logo[0].filename}`;
    }
    await product.update(data);
    success(res, "Product Updated Successfully", { product });
  } catch (err) {
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
      where.product_name = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Product.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      include: [
        {
          model: Faq,
          as: "faqs",
          where: { status: true },
          required: false,
          order: [["id", "ASC"]],
        },
      ],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Products Fetched Successfully", {
      totalCount: count,
      productsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};
exports.get = async (req, res) => {
  try {
    const product = await Product.findByPk(req.body.id, {
      include: [
        {
          model: Faq,
          as: "faqs",
          where: { status: true },
          required: false,
        },
      ],
    });
    if (!product) return error(res, "Product Not Found", 404);
    success(res, "Products Fetched Successfully", { products });
  } catch (err) {
    error(res, err.message);
  }
};
exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.body.id);
    if (!product) return error(res, "Product Not Found", 404);
    deleteImg("product", product.image);
    deleteImg("product", product.logo);
    await product.destroy();
    success(res, "Product Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const product = await Product.findByPk(req.body.id);
    if (!product) return error(res, "Product Not Found", 404);
    await product.update(data);
    success(res, "Product Status Updated Successfully", { product });
  } catch (err) {
    error(res, err.message);
  }
};
// Web Application
exports.productsList = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: true },
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "product_name",
        "category_name",
        "description",
        "slug",
        "tag",
        "key_feature",
        "benefit",
        "image",
        "logo",
      ],
      include: [
        {
          model: Faq,
          as: "faqs",
          where: { status: true },
          required: false,
          attributes: ["id", "question", "answer"],
        },
      ],
    });
    success(res, "Products Fetched Successfully", {
      count: products.length,
      productsList: products,
    });
  } catch (err) {
    error(res, err.message);
  }
};
exports.productsShow = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        slug: req.body.slug,
        status: true,
      },
      include: [
        {
          model: Faq,
          as: "faqs",
          where: { status: true },
          required: false,
          attributes: ["id", "question", "answer"],
        },
      ],
    });
    if (!product) return error(res, "Product Not Found", 404);
    success(res, "Products Fetched Successfully", { product });
  } catch (err) {
    error(res, err.message);
  }
};

