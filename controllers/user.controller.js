const mongoose = require("mongoose");
const lodash = require("lodash");
const { AppError, sendResponse } = require("../helpers/untils");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const userController = {};


userController.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, "Bad request", console.log("errors", errors.message))
    }
    try {
        const info = {
            name: lodash.startCase(req.body.name),
            email: req.body.email,
            role: "Employee",
            tasks: null
        }
        if (!info) throw new AppError(402, "Bad request", "Create User Error");
        const created = await User.create(info);
        sendResponse(res, 200, true, {users: created}, null, "Created User Successfully");

    } catch (error) {
        next(error)
    }
}


userController.getUsers = async (req, res, next) => {
    try {
        // search name
        let { name , page, limit } = req.query; 
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        let filter = { isDeleted : false };

        if (name) {
            filter.name = { $regex: name, $options: 'i'};
        }
       
        const users = await User.find(filter)
          .skip(limit * (page - 1))
          .limit(limit)

	    if(!users.length) throw new AppError(400, "No users found");

        sendResponse(res, 200, true, users, null, "Get users sucessfully")

    } catch (error) {
        next(error)
    }
};

userController.getTasksOfSingleUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, "Bad request", console.log("errors", errors.message))
    }
    try {
        const { userId } = req.params;
        const tasksOfUser = await User.findById(userId).populate("tasks");

        if (!userId) {
           throw new AppError(401, "No user found")
        }
        
        sendResponse(res, 200, true, tasksOfUser, null, "Get Task of an user successfully")
    } catch (error) {
        next(error)
    }
}

module.exports = userController;


//$regex is a MongoDB operator that allows us to perform regular expression search on string fields in the database. It is used to search for a string pattern within a string field. 
// $options is used to specify various options for the $regex operator. It is used to modify the behavior of the regular expression search. For example, the i option makes the search case-insensitive, while the m option allows the search to match across multiple lines.
//So, $regex and $options are useful operators in MongoDB that allow us to perform complex searches on string fields.