const { body, param } = require("express-validator");
const { isValidObjectId } = require("mongoose");


exports.userValidation = (method) => {
    switch(method) {
        case 'createUser': {
            return [
                body("name").notEmpty().isString().withMessage("Name is require"),
                body("email").notEmpty().isEmail().withMessage("Email is require"),
            ];
        }
        case 'getTasksOfSingleUser': {
            return [
                param('userId').custom(value => { 
                    return isValidObjectId(value)
                }).withMessage("Invalid user Id")
            ]
        }
    }
};