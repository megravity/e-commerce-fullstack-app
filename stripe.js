// This is your test secret API key.
const stripe = require("stripe")(
    "sk_test_51MquI4LX9GPgXOVyjNEj6GniEsqDcv3vVyFvy2eIykihU88GEVHnaagpdpjmscuDOVXd222JxmsJ7ReYXaljfYET008HPJjHQX"
);
const express = require("express");
const app = express();

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: "{{PRICE_ID}}",
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.json({ url: session.url });
});

app.listen(4242, () => console.log("Running on port 4242"));
