import { Router } from "express";
import {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    loginUser,
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import rules from "../middlewares/validators.js";

const router = Router();

router.get("/", auth, isAdmin, getUsers);

router.get("/refreshPage", auth, (req, res) => {
    res.json({ success: true, data: req.user });
});

router.get("/:id", auth, isAdmin, getUser);

router.post("/", rules, addUser);

router.post("/login", loginUser);

router.patch("/:id", auth, isAdmin, updateUser);

router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
