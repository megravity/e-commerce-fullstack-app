import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "user",
        enum: ["user"],
    },
    profileImage: {
        type: String,
        default: function () {
            return `https://robohash.org/${this.firstName}`;
        },
    },
    orders: [{ type: Schema.Types.ObjectId, ref: "orders" }],
});

userSchema.indexes({ email: 1 });

const UserCollection = model("users", userSchema);

export default UserCollection;
