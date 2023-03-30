import OrderCollection from "../models/orderSchema.js";
import { stripe } from "../app.js";
import ProductCollection from "../models/productSchema.js";

export const getOrders = async (_, res) => {
    try {
        const orders = await OrderCollection.find()
            .populate("userId", "lastName email")
            .populate("products", "title price");
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const userOrders = await OrderCollection.find({ userId: id }).populate(
            "products"
        );
        res.json({ success: true, data: userOrders });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderCollection.findById(id);
        if (Order) {
            res.json({ success: true, data: order });
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

export const addOrder = async (req, res) => {
    try {
        const data = [];
        for (const id of req.body.products) {
            data.push(await ProductCollection.findById(id));
        }

        const line_items = data.map((product) => {
            return {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.title,
                        images: [product.thumbnail],
                        description: product.description,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: 1,
            };
        });
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `http://localhost:5173/cart?success=true`,
            cancel_url: `http://localhost:5173/cart?success=false`,
        });

        res.json({ success: true, url: session.url });

        /* const order = OrderCollection.create(req.body) */
        /*  const order = new OrderCollection(req.body)
        await order.save() 
        res.json({success:true, data:order}) */
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await OrderCollection.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (updatedOrder) {
            res.json({ success: true, data: updatedOrder });
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

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await OrderCollection.findByIdAndDelete(id);
        if (deletedOrder) {
            res.json({ success: true, data: deletedOrder });
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
