import Product from "../models/Product.js";

export const buildFilters = async (search = null) => {
  const filterQuery = {
    status: true,
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

  const [brands, categories, price] = await Promise.all([
    Product.aggregate([
      {
        $match: filterQuery,
      },
      {
        $group: {
          _id: "$brand",
          count: {
            $sum: 1,
          },
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
      {
        $match: filterQuery,
      },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
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
      {
        $match: filterQuery,
      },
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
  ]);

  return {
    brands,
    categories,
    price: {
      min: price[0]?.min ?? 0,
      max: price[0]?.max ?? 0,
    },
  };
};