const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "working", "review", "done", "archive" ],
        required: true,
        default: "pending"
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "users",
        default: null
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;