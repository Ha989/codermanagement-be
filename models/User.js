const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["Manager", "Employee"],
        default: "Employee",
        required: true,
    },
    tasks: [{ 
        type: Schema.Types.ObjectId, 
        ref: "tasks",
        default: null
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, 
{ timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User