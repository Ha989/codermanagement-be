const express = require("express");
const { 
    createUser,
    getUsers,
    getTasksOfSingleUser
} = require("../controllers/user.controller");

const {
    userValidation
} = require("../validations/userValidation");

const router = express.Router();

/**
 * @route POST api/
 * @description Create a new user
 * @access private
 */
router.post("/", userValidation('createUser'), createUser);

/**
 * @route GET api/
 * @description get a list of users
 * @access public
 */

router.get("/", getUsers);

/**
 * @route GET api/:userId
 * @description get all tasks of a user
 * @access private
 */

router.get("/:userId", userValidation('getTasksOfSingleUser'), getTasksOfSingleUser);


module.exports = router;