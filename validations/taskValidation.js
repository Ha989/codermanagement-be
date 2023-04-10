const { body, param, query } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const validStatusList = ["pending", "working", "review", "done", "archive"]

exports.taskValidation = (method) => {
    switch(method) {
        case 'createTask': {
            return [
                body("title").notEmpty()
                .withMessage("Title is required"),
                body("description").notEmpty()
                .withMessage("Description is required"),
            ];
        }
        // case 'getTasks': {
        //     return [
        //         // query('title').isString().withMessage("Title is not correct"),
        //         query('status').isIn(validStatusList)
        //         .withMessage('Invalid status value')
        //     ];
        // }
        case 'assignTask': {
            return [
                param('taskId').custom(value => {
                    return isValidObjectId(value)
                }).withMessage("Invalid task Id"),
                body('assignedTo')
                .if(body('assignedTo').exists()).notEmpty()
                .withMessage('Assigned is required')
            ]
        }
        case 'unassignTask': {
            return [
                param('taskId').custom(value => {
                    return isValidObjectId(value)
                }).withMessage('Invalid task Id')
            ]
        }
        case 'updateStatusTask': {
            return [
                param('taskId').custom(value => {
                    return isValidObjectId(value)
                }).withMessage("Invalid task Id"),

                body('status').notEmpty()
                .withMessage("Status is required")
                .isIn(["pending", "working", "review", "done", "archive"])
                .withMessage('Invalid status value')
            ]
        }
        case 'getSingleTask': {
            return [
                param('taskId').custom(value => {
                    return isValidObjectId(value)
                }).withMessage("Invalid task Id")
            ];
        }
        case 'deleteTask': {
            return [
                param('taskId').custom(value => {
                    return isValidObjectId(value)
                }).withMessage("Invalid task Id")
            ]
        }
    }
}

