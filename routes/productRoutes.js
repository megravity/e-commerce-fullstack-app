import { Router } from "express";
import {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
} from "../controllers/productController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", auth, isAdmin, addProduct);

router.patch("/:id", auth, isAdmin, updateProduct);

router.delete("/:id", auth, isAdmin, deleteProduct);

export default router;
