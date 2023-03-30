import UserCollection from "../models/userSchema.js";
import ImageCollection from "../models/imageSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const getUsers = async (_, res) => {
    try {
        const users = await UserCollection.find();
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserCollection.findById(id);
        if (user) {
            res.json({ success: true, data: user });
        } else {
            res.status(404).json({
                success: false,
                message: "Please provide a valid ID",
            });
        }
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const user = new UserCollection(req.body);

        if (req.files) {
            const image = new ImageCollection({
                filename: new Date().getTime() + "_" + req.files.image.name,
                data: req.files.image.data,
                userId: user._id,
            });
            await image.save();
            user.profileImage = `http://localhost:4000/images/${image.filename}`;
        }

        const hashedPassword = bcrypt.hashSync(user.password, 11);
        user.password = hashedPassword;

        await user.save();
        res.json({ success: true, data: user });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await UserCollection.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (updatedUser) {
            res.json({ success: true, data: updatedUser });
        } else {
            res.status(404).json({
                success: false,
                message: "Please provide a valid ID",
            });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserCollection.findByIdAndDelete(id);
        if (deletedUser) {
            res.json({ success: true, data: deletedUser });
        } else {
            res.status(404).json({
                success: false,
                message: "Please provide a valid ID",
            });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserCollection.findOne({ email });
        if (user) {
            const verifyPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (verifyPassword) {
                const token = jwt.sign(
                    { _id: user._id, email: user.email },
                    process.env.SIGNATURE,
                    {
                        expiresIn: "1h",
                        issuer: "admin",
                        audience: "e-commerce-user",
                    }
                );
                res.header("token", token).json({ success: true, data: user });
            } else {
                res.json({ success: false, message: "Wrong password" });
            }
        } else {
            res.json({ success: false, message: "Email does not exist" });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
