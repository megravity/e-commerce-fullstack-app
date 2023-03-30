import { Router } from "express";
import {
    getOrders,
    getOrder,
    getUserOrders,
    addOrder,
    updateOrder,
    deleteOrder,
} from "../controllers/orderController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", auth, isAdmin, getOrders);

router.get("/userorders/:id", auth, isAdmin, getUserOrders);

router.get("/:id", auth, isAdmin, getOrder);

router.post("/", auth, addOrder);

router.patch("/:id", auth, isAdmin, updateOrder);

router.delete("/:id", auth, isAdmin, deleteOrder);

export default router;
