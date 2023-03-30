import ProductCollection from "../models/productSchema.js";

export const getProducts = async (_, res) => {
    try {
        const products = await ProductCollection.find();
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductCollection.findById(id);
        if (product) {
            res.json({ success: true, data: product });
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

export const addProduct = async (req, res) => {
    try {
        const product = new ProductCollection(req.body);
        await product.save();
        res.json({ success: true, data: product });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await ProductCollection.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (updatedProduct) {
            res.json({ success: true, data: updatedProduct });
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

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductCollection.findByIdAndDelete(id);
        if (deletedProduct) {
            res.json({ success: true, data: deletedProduct });
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
