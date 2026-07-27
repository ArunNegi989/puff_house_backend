    import express from "express";

    import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    featuredProducts,
    newArrivalProducts,
    popularProducts,
    categoryProducts,
    relatedProducts,
    toggleProductStatus,
    getDealsProducts,
    } from "../controllers/productController.js";

    import { authenticate, authorize } from "../middleware/authMiddleware.js";
    import uploadProduct from "../middleware/uploadProduct.js";
    import { productValidation } from "../validators/productValidator.js";

    const router = express.Router();

    /* ==========================================================
    PUBLIC ROUTES
    ========================================================== */

    router.get("/", getProducts);

    router.get("/featured", featuredProducts);

    router.get("/new-arrivals", newArrivalProducts);

    router.get("/popular", popularProducts);

    router.get("/category/:category", categoryProducts);

    router.get("/related/:slug", relatedProducts);

    router.get("/deals", getDealsProducts);

    router.get("/:slug", getProduct);

    /* ==========================================================
    ADMIN ROUTES
    ========================================================== */

    router.post(
    "/",
    authenticate,
    authorize("admin"),
    uploadProduct.array("images", 10),
    productValidation,
    createProduct
    );

    router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    uploadProduct.array("images", 10),
    productValidation,
    updateProduct
    );

    router.patch(
    "/:id/status",
    authenticate,
    authorize("admin"),
    toggleProductStatus
    );

    router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteProduct
    );

    export default router;