const express = require('express');
const {
    createTask,
    updateStatusTask,
    getTasks,
    getSingleTask,
    deleteTask,
    assignTask,
    unassignTask
} = require('../controllers/task.controller');

const {
    taskValidation
} = require('../validations/taskValidation');

const router = express.Router();

/**
 * @route POST api/
 * @description create task
 * @access private
 */
router.post("/", taskValidation('createTask'), createTask);


/**
 * @route PUT api/assign/:taskId
 * @description assign or unassign an employee in a task
 * @access private  
 */
router.put("/:taskId/assign/:userId", taskValidation('assignTask'), assignTask);

/**
 * 
 */

router.put("/:taskId/unassign/:userId", taskValidation('unassignTask'), unassignTask);

/**
 * @route PUT api/:taskId
 * @description update status of a task
 * @access private
 */
router.put("/:taskId", taskValidation('updateStatusTask'), updateStatusTask);

/**
 * @route GET api/
 * @description get list of tasks 
 * @access private
 */
router.get("/", getTasks);

/**
 * @route GET api/:taskId
 * @description get a single task
 * @access private
 */
router.get("/:taskId", taskValidation('getSingleTask'), getSingleTask);

/**
 * @route DELETE api/:taskId
 * @description soft delete of a task
 * @access private
 */

router.delete("/:taskId", taskValidation('deleteTask'), deleteTask);


module.exports = router;




