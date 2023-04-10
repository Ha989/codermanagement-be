const mongoose = require("mongoose");
const lodash = require("lodash");
const { AppError, sendResponse } = require("../helpers/untils");
const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {};


taskController.createTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(400, "Bad request",console.log("errors", errors.message))
    };
    try {
      const info = {
          title: lodash.startCase(req.body.title),
          description: req.body.description,
          status: "pending",
          assignedTo: null
      }
      if (!info) throw new AppError( 402, "Bad request", "Create task error");
      const created = await Task.create(info);
      sendResponse(res, 200, true, {tasks: created}, null, "Create task succesfully")
    } catch (error) {
        next(error)
    }
};

taskController.getTasks = async (req, res, next) => {

    try {
        let { title, status } = req.query;

        let filter = { isDeleted: false };

        if (title) filter.title = { $regex: title, $options: 'i'}

        if (status) filter.status =  status ;
        console.log("filter", filter)
       
        const tasks = 
        await Task.find(filter)
        .sort({ createAt: -1, updateAt: -1 })
        
        if (!tasks.length)  throw new AppError(402, "No task found");
        sendResponse(res, 200, true, tasks, null, "Get Tasks Successfully")
    } catch (error) {
        next(error)
    }
}

taskController.getSingleTask = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new AppError(400, "Bad Request", console.log("errors", errors.message))
    }
    try {
        const { taskId } = req.params;
        const singleTask = await Task.findById(taskId);
        
        if(!taskId) {
            throw new AppError(401, "No task found")
        }

        sendResponse(res, 200, true, singleTask, null, "Get a task successfully")

    } catch (error) {
        next(error)
    }
}

taskController.deleteTask = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new AppError(400, "Bad Request", console.log("errors", errors.message))
    }

    try {
        const { taskId } = req.params;
        const options = { new: true }

        if (!taskId) throw new AppError(404, "Delete Car Error! No task found")
        
        const deletedTask = await Task.findByIdAndUpdate(taskId, { isDeleted: true}, options)
        sendResponse(res, 200, true, deletedTask, null, "Deleted task successfully");

    } catch (error) {
        next(error)
    }
}


taskController.updateStatusTask = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new AppError(400, "Bad Request", console.log("errors", errors.message))
    }
    try {
        const { taskId } = req.params;
        console.log(taskId)
        const {status} = req.body;
        const options = { new: true }
        
        const task = await Task.findById(taskId).populate('assignedTo').select({ status });

        if (!task) throw new AppError("404", "No task found" );
        // if (task.assignedTo.taskId !== req.user.userId) {
        //     throw new AppError(401, "You are not authorized to update this task");
        // }

        // const currentStatus = task.status
        // console.log("current", typeof currentStatus)
        // if (currentStatus === "done" && currentStatus === "archive") {
        //     if (status !== 'archive') throw new AppError("Can not change status when task archived")
        // } 
        
        // if (task.status !== "done" || task.status !== 'archive') {
            //     task.status = status;
            //     console.log(status)
            // }
            if ( task.status === "done" || task.status === 'archive') {
                task.status = 'archive'
                if (task.status !== 'archive') throw new AppError(400, "Status must be set to archive")
            };
            const updated = await Task.findOneAndUpdate(taskId, {status: task.status}, options)

         sendResponse(res, 200, true, updated, null, "Updated status successfully")

    } catch (error) {
        next(error)
    }
}


taskController.assignTask = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log("errors", errors.message)
        throw new AppError(400, "Bad Request")
    }

    try {
        
        const { taskId } = req.params;
        const { userId } = req.params;
       
        const options = { new: true};

        const task = await Task.findById(taskId);
       
        const user = await User.findById(userId);
      
        if (!task || !user ) throw new AppError(404, "Task or User not found");
        if(task.assignedTo) throw new AppError(400, "Task already assigned")

        const taskAssigned = await Task.findByIdAndUpdate(taskId, {$set: { assignedTo: userId}}, options);

        const userTask = await User.findByIdAndUpdate(userId, {$set: { tasks: taskId }}, options)
      
        sendResponse(res, 200, true, { taskAssigned, userTask }, null, "Assigned to user successfully" )
    } catch (error) {
        next(error)
    }
}

taskController.unassignTask = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log("errors", errors.message)
        throw new AppError(400, "Bad Request")
    }
    try {
        const { taskId } = req.params;
        const { userId } = req.params;
        const options = { new: true};

        const task = await Task.findById(taskId);
       
        const user = await User.findById(userId);

        if (!task || !user ) throw new AppError(404, "Task or User not found");
        if( !task.assignedTo) throw new AppError(404, "Task has not assign yet");

        const unassignTask = await Task.findByIdAndUpdate(taskId, {$set: { assignedTo: null}}, options);

        const unAssignUser = await User.findByIdAndUpdate(userId, {$pull: { tasks: taskId }}, options);

        sendResponse(res, 200, true, { unassignTask, unAssignUser }, null, "Unssigned to user successfully" )

    } catch (error) {
        next(error)
    }
}


module.exports = taskController