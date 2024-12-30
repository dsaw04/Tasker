import Task from "../models/taskModel.js";
import mongoose from "mongoose";

/**
 * Checks whether a date is either today or in the future.
 * @param {Date} date
 */
const isTodayOrFuture = (date) => {
  const currentDate = new Date();
  return new Date(date).getTime() >= currentDate.getTime();
};

export const create = async (req, res) => {
  try {
    const { description, date, status } = req.body;

    if (!description || !date) {
      return res.status(400).json({
        success: false,
        message: "Description and date are required.",
      });
    }

    if (!isTodayOrFuture(date)) {
      return res.status(400).json({
        success: false,
        message: "Date cannot be in the past.",
      });
    }

    // Avoid global duplicate task check; scope it to the user
    const taskExist = await Task.findOne({
      description,
      user: req.user, // Match description within the user's tasks
    });
    if (taskExist) {
      return res.status(400).json({
        success: false,
        message: "Duplicate task exists.",
      });
    }

    const newTask = new Task({
      description,
      date,
      status,
      user: req.user, // Assign the user's ObjectId
    });
    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: savedTask,
    });
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    // Debugging: Check req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const tasks = await Task.find({ user: req.user });

    if (!tasks.length) {
      return res.status(200).json({
        success: true,
        message: "No tasks found.",
        data: [], // Return an empty array for no tasks
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully.",
      data: tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

export const searchTasks = async (req, res) => {
  try {
    const { description } = req.query;

    const searchCriteria = { user: req.user.id };
    if (description) {
      searchCriteria.description = {
        $regex: `^${description}`,
        $options: "i",
      };
    }

    const taskData = await Task.find(searchCriteria);

    if (!taskData.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks match the criteria.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Matching tasks retrieved successfully.",
      data: taskData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized access.",
      });
    }

    Object.assign(task, updates);
    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: updatedTask,
    });
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized access.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: task,
    });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};
