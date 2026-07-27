import slugify from "slugify";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { buildFilters } from "../utils/buildFilters.js";

/* ==========================================================
   CREATE PRODUCT
========================================================== */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    category,
    shortDescription,
    description,
    price,
    oldPrice,
    stock,
    sku,
    tags,
    colors,
    features,
    specifications,
    isFeatured,
    isNewArrival,
    isPopular,
    isDeal,
  } = req.body;

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const exists = await Product.findOne({ slug });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Product already exists.",
    });
  }

  const images =
    req.files?.map(
      (file) => `/uploads/products/${file.filename}`
    ) || [];

  const product = await Product.create({
    name,
    slug,
    brand,
    category,
    shortDescription,
    description,
    price,
    oldPrice,
    stock,
    sku,

    tags:
      typeof tags === "string"
        ? JSON.parse(tags)
        : tags,

    colors:
      typeof colors === "string"
        ? JSON.parse(colors)
        : colors,

    features:
      typeof features === "string"
        ? JSON.parse(features)
        : features,

    specifications:
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications,

    isFeatured,
    isNewArrival,
    isPopular,
    isDeal,

    images,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product,
  });
});

/* ==========================================================
   GET ALL PRODUCTS
========================================================== */

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    featured,
    newArrival,
    popular,
    deal,
    sort,
  } = req.query;

  const query = {
    status: true,
  };

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }


  if (category) {
    query.category = {
      $in: category
        .split(",")
        .map((item) => item.trim()),
    };
  }


  if (brand) {
    query.brand = {
      $in: brand
        .split(",")
        .map((item) => item.trim()),
    };
  }

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  if (featured === "true") {
    query.isFeatured = true;
  }

  if (newArrival === "true") {
    query.isNewArrival = true;
  }

  if (popular === "true") {
    query.isPopular = true;
  }
  if (deal === "true") {
    query.isDeal = true;
  }

  const filters = await buildFilters(search);
  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
    case "price-low":
      sortOption = { price: 1 };
      break;

    case "price-high":
      sortOption = { price: -1 };
      break;

    case "rating":
      sortOption = { rating: -1 };
      break;

    case "name":
      sortOption = { name: 1 };
      break;
  }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({
    success: true,

    total,

    page: Number(page),

    pages: Math.ceil(total / limit),

    filters,

    products,
  });

});

/* ==========================================================
   GET PRODUCT BY SLUG
========================================================== */

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    status: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  product.views += 1;

  await product.save();

  res.json({
    success: true,
    product,
  });
});

/* ==========================================================
   UPDATE PRODUCT
========================================================== */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });
  }

  if (req.body.tags) {
    req.body.tags = JSON.parse(req.body.tags);
  }

  if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
  }

  if (req.body.features) {
    req.body.features = JSON.parse(req.body.features);
  }

  if (req.body.specifications) {
    req.body.specifications = JSON.parse(
      req.body.specifications
    );
  }

  let existingImages = [];

  if (req.body.existingImages) {
    existingImages = JSON.parse(req.body.existingImages);
  } else {
    existingImages = [...product.images];
  }

  let removedImages = [];

  if (req.body.removedImages) {
    removedImages = JSON.parse(req.body.removedImages);
  }

  const uploadedImages =
    req.files?.map(
      (file) =>
        `/uploads/products/${file.filename}`
    ) || [];

  req.body.images = [
    ...existingImages,
    ...uploadedImages,
  ];

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  for (const image of removedImages) {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        image.replace(/^\/+/, "")
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(
        "Image delete failed:",
        err.message
      );
    }
  }

  res.json({
    success: true,
    message: "Product updated successfully.",
    product: updated,
  });
});

/* ==========================================================
   DELETE PRODUCT
========================================================== */

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  if (product.images?.length) {
    for (const image of product.images) {
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          image.replace(/^\/+/, "")
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(
          `Failed to delete image: ${image}`,
          error.message
        );
      }
    }
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted successfully.",
  });
});

/* ==========================================================
   FEATURED PRODUCTS
========================================================== */

export const featuredProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    status: true,
    isFeatured: true,
  }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    products,
  });
});

/* ==========================================================
   NEW ARRIVALS
========================================================== */

export const newArrivalProducts = asyncHandler(async (req, res) => {

  const {
    page = 1,
    limit = 8,
    sort = "featured",
    brand,
    category,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    search,
  } = req.query;

  const query = {
    status: true,
    isNewArrival: true,
    price: {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    },
  };

  if (brand) {
    query.brand = {
      $in: brand.split(",").map(item => item.trim()),
    };
  }
  if (category) {
    query.category = {
      $in: category.split(",").map(item => item.trim()),
    };
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {

    case "price-low":
      sortOption = {
        price: 1,
      };
      break;

    case "price-high":
      sortOption = {
        price: -1,
      };
      break;

    case "rating":
      sortOption = {
        rating: -1,
      };
      break;

    case "featured":
      sortOption = {
        isFeatured: -1,
        createdAt: -1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };

  }

  const filterQuery = {
    status: true,
    isNewArrival: true,
  };

  if (brand) {
    filterQuery.brand = {
      $in: brand.split(",").map(item => item.trim()),
    };
  }

  if (category) {
    filterQuery.category = {
      $in: category.split(",").map(item => item.trim()),
    };
  }

  if (search) {
    filterQuery.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [brands, categories, price, totalProducts, products] = await Promise.all([

    Product.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: "$brand",
          count: {
            $sum: 1,
          },
        },
      },
    ]),
    Product.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
    ]),
    Product.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: null,
          min: {
            $min: "$price",
          },
          max: {
            $max: "$price",
          },
        },
      },
    ]),

    Product.countDocuments(query),

    Product.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),

  ]);

  const filters = {

    brands: brands.map(item => ({
      name: item._id,
      count: item.count,
    })),

    categories: categories.map(item => ({
      name: item._id,
      count: item.count,
    })),

    price: {
      min: price[0]?.min ?? 0,
      max: price[0]?.max ?? 0,
    },

  };

  res.status(200).json({

    success: true,

    products,

    filters,

    total: totalProducts,

    page: Number(page),

    pages: Math.ceil(totalProducts / Number(limit)),

    hasMore:
      Number(page) * Number(limit) < totalProducts,

  });

});

/* ==========================================================
   POPULAR PRODUCTS
========================================================== */


export const popularProducts = asyncHandler(async (req, res) => {

  const {
    page = 1,
    limit = 8,
    sort = "featured",
    brand,
    category,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    search,
  } = req.query;

  const query = {
    status: true,
    isPopular: true,
    price: {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    },
  };

  if (brand) {
    query.brand = {
      $in: brand.split(",").map(item => item.trim()),
    };
  }

  if (category) {
    query.category = {
      $in: category.split(",").map(item => item.trim()),
    };
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortOption = {
    rating: -1,
  };

  switch (sort) {

    case "price-low":
      sortOption = {
        price: 1,
      };
      break;

    case "price-high":
      sortOption = {
        price: -1,
      };
      break;

    case "rating":
      sortOption = {
        rating: -1,
      };
      break;

    case "featured":
      sortOption = {
        isFeatured: -1,
        rating: -1,
      };
      break;

    default:
      sortOption = {
        rating: -1,
      };

  }

  const filterQuery = {
    status: true,
    isPopular: true,
  };

  if (brand) {
    filterQuery.brand = {
      $in: brand.split(",").map(item => item.trim()),
    };
  }

  if (category) {
    filterQuery.category = {
      $in: category.split(",").map(item => item.trim()),
    };
  }

  if (search) {
    filterQuery.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [
    brands,
    categories,
    price,
    totalProducts,
    products,
  ] = await Promise.all([

    Product.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: "$brand",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    Product.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    Product.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: null,
          min: {
            $min: "$price",
          },
          max: {
            $max: "$price",
          },
        },
      },
    ]),

    Product.countDocuments(query),

    Product.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),

  ]);

  const filters = {

    brands: brands.map(item => ({
      name: item._id,
      count: item.count,
    })),

    categories: categories.map(item => ({
      name: item._id,
      count: item.count,
    })),

    price: {
      min: price[0]?.min ?? 0,
      max: price[0]?.max ?? 0,
    },

  };

  res.status(200).json({

    success: true,

    products,

    filters,

    total: totalProducts,

    page: Number(page),

    pages: Math.ceil(totalProducts / Number(limit)),

    hasMore:
      Number(page) * Number(limit) < totalProducts,

  });

});

/* ==========================================================
   PRODUCTS BY CATEGORY
========================================================== */

export const categoryProducts = asyncHandler(async (req, res) => {

  const { category } = req.params;

  const {
    page = 1,
    limit = 8,
    sort = "featured",
    brand,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    search,
  } = req.query;

  const query = {
    status: true,
    category: category.toLowerCase(),
    price: {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    },
  };

  if (brand) {
    query.brand = {
      $in: brand.split(",").map(item => item.trim())
    }
  }
  const filterQuery = {
    status: true,
    category: category.toLowerCase(),
  };

  if (search) {
    filterQuery.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }
  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {

    case "price-low":
      sortOption = {
        price: 1,
      };
      break;

    case "price-high":
      sortOption = {
        price: -1,
      };
      break;

    case "rating":
      sortOption = {
        rating: -1,
      };
      break;

    case "featured":
      sortOption = {
        isFeatured: -1,
        createdAt: -1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };

  }
  const brands = await Product.aggregate([
    { $match: filterQuery },
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
      },
    },
  ]);

  const price = await Product.aggregate([
    { $match: filterQuery },
    {
      $group: {
        _id: null,
        min: { $min: "$price" },
        max: { $max: "$price" },
      },
    },
  ]);

  const filters = {
    brands: brands.map((b) => ({
      name: b._id,
      count: b.count,
    })),
    categories: [],
    price: {
      min: price[0]?.min ?? 0,
      max: price[0]?.max ?? 0,
    },
  };
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortOption)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({

    success: true,

    total,

    page: Number(page),

    pages: Math.ceil(total / Number(limit)),

    hasMore:
      Number(page) * Number(limit) < total,

    products,
    filters,
  });

});

/* ==========================================================
   RELATED PRODUCTS
========================================================== */

export const relatedProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({
    slug,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  const products = await Product.find({
    category: product.category,
    _id: {
      $ne: product._id,
    },
    status: true,
  }).limit(4);

  res.json({
    success: true,
    products,
  });
});

/* ==========================================================
   CHANGE STATUS
========================================================== */

export const toggleProductStatus = asyncHandler(
  async (req, res) => {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.status = !product.status;

    await product.save();

    res.json({
      success: true,
      message: "Status updated successfully.",
      product,
    });
  }
);
export const getDealsProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      brand,
      category,
      minPrice,
      maxPrice,
      sort = "featured",
    } = req.query;

    const query = {
      status: true,
      isDeal: true,
    };

    if (brand?.trim()) {
      query.brand = {
        $in: brand.split(",").map((item) => item.trim()),
      };
    }

    if (category?.trim()) {
      query.category = {
        $in: category.split(",").map((item) => item.trim()),
      };
    }

    const hasMin =
      minPrice !== undefined &&
      Number(minPrice) > 0;

    const hasMax =
      maxPrice !== undefined &&
      Number(maxPrice) > 0;

    if (hasMin || hasMax) {
      query.price = {};

      if (hasMin) {
        query.price.$gte = Number(minPrice);
      }

      if (hasMax) {
        query.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;

      case "price-high":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "featured":
        sortOption = {
          isFeatured: -1,
          createdAt: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const [
      products,
      total,
      brands,
      categories,
      priceStats,
    ] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      Product.countDocuments(query),

      Product.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$brand",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
          },
        },
        {
          $sort: {
            name: 1,
          },
        },
      ]),

      Product.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
          },
        },
        {
          $sort: {
            name: 1,
          },
        },
      ]),

      Product.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            min: { $min: "$price" },
            max: { $max: "$price" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      products,
      filters: {
        brands,
        categories,
        price: {
          min: priceStats[0]?.min ?? 0,
          max: priceStats[0]?.max ?? 0,
        },
      },
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      hasMore:
        Number(page) * Number(limit) < total,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deals products.",
    });
  }
};