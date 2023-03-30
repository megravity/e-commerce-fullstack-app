import { body, validationResult } from "express-validator";

const rules = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("Password needs to be a string")
        .isLength({ min: 4 })
        .withMessage("Password needs to be at least 4 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        } else {
            res.json({
                success: false,
                message: errors
                    .array()
                    .map((err) => ({ [err.param]: err.msg })),
            });
        }
    },
];

export default rules;
