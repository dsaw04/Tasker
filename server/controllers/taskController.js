import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import {
  handleOverdueTasks,
  isDuplicateTask,
  isTodayOrFuture,
} from "../utils/taskUtils.js";
import { incrementUserStreak } from "../utils/userMetricUtils.js";

//Create a new task for a given user. Ensures the task is a valid task for the future.
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

    if (await isDuplicateTask(req.user, description, date)) {
      return res.status(400).json({
        success: false,
        message: "Duplicate task exists.",
      });
    }

    const newTask = new Task({
      description,
      date,
      status,
      user: req.user,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
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

//Fetch all of a given user's tasks.

//FIX ME - remove write from this fetch task.
export const getAllTasks = async (req, res) => {
  try {
    await handleOverdueTasks(req.user);
    const tasks = await Task.find({ user: req.user });

    if (!tasks.length) {
      return res.status(200).json({
        success: true,
        message: "No tasks found.",
        data: [],
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

//Search for tasks based on the users query. Returns an empty array if no matches were found.

//might need fixes
export const searchTasks = async (req, res) => {
  try {
    const { description } = req.query;

    const searchCriteria = { user: req.user };
    if (description) {
      searchCriteria.description = {
        $regex: `^${description}`,
        $options: "i",
      };
    }

    const taskData = await Task.find(searchCriteria);

    if (!taskData.length) {
      return res.status(200).json({
        success: true,
        message: "No tasks match the criteria.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Matching tasks retrieved successfully.",
      data: taskData,
    });
  } catch (err) {
    console.error("Error in searchTasks:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

//Update a given user task. Validates any modified tasks (i.e. ignores if they were overdue in the past).
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
        message: "Task not found.",
      });
    }

    //what if it takes 1 minute to update task?
    if (updates.date && new Date(updates.date) > new Date()) {
      task.isOverdue = false;
    }

    Object.assign(task, updates);
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
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

//Delete a given user task.
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

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

    await task.deleteOne();

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

//Marks a task as done.
export const markDone = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Increment streak only if task is **not overdue**
    if (!task.isOverdue) {
      await incrementUserStreak(req.user);
    }

    await task.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Task marked as done and streak updated successfully!",
    });
  } catch (err) {
    console.error("Error marking task as done:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};
