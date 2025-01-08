import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
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

    // Check if the date is today or in the future
    if (!isTodayOrFuture(date)) {
      return res.status(400).json({
        success: false,
        message: "Date cannot be in the past.",
      });
    }

    // Get the user from the request (assumes middleware adds `req.user`)
    const userId = req.user;
    const userObject = await User.findById(userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    // Check for duplicate tasks for the same user
    const taskExist = await Task.findOne({
      description,
      user: userId, // Ensure it's scoped to the current user
    });

    if (taskExist) {
      return res.status(400).json({
        success: false,
        message: "Duplicate task exists.",
      });
    }

    if (userObject.role === "guest") {
      const taskCount = await Task.countDocuments({ user: userId });

      if (taskCount >= userObject.guestTaskLimit) {
        return res.status(403).json({
          success: false,
          message: "Guest users can only add up to 5 tasks.",
        });
      }
    }

    const newTask = new Task({
      description,
      date,
      status,
      user: userId,
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

    const now = new Date();

    await Task.updateMany(
      { user: req.user, date: { $lt: now } },
      { $set: { isOverdue: true } }
    );

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

    const searchCriteria = { user: req.user };
    if (description) {
      searchCriteria.description = {
        $regex: `^${description}`, // Match only descriptions starting with the query
        $options: "i", // Case-insensitive search
      };
    }

    const taskData = await Task.find(searchCriteria);

    if (!taskData.length) {
      return res.status(200).json({
        success: true,
        message: "No tasks match the criteria.",
        data: [], // Return an empty array instead of 404
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

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    // Find the task scoped to the authenticated user
    const task = await Task.findOne({ _id: id, user: req.user });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized access.",
      });
    }

    const now = new Date();

    if (updates.date && new Date(updates.date) > now) {
      task.isOverdue = false;
    }

    // Enforce guest edit limit
    const userObject = await User.findById(req.user);

    if (userObject.role === "guest") {
      if (userObject.guestEditLimit <= 0) {
        return res.status(403).json({
          success: false,
          message: "Guest users can only edit/delete tasks 10 times.",
        });
      }

      // Deduct one from the edit/delete limit
      userObject.guestEditLimit -= 1;
      await userObject.save();
    }

    // Apply updates to the task
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

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    // Find the task scoped to the authenticated user
    const task = await Task.findOne({ _id: id, user: req.user });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized access.",
      });
    }

    // Enforce guest delete limit
    const userObject = await User.findById(req.user);
    if (userObject.role === "guest") {
      if (userObject.guestEditLimit <= 0) {
        return res.status(403).json({
          success: false,
          message: "Guest users can only edit/delete tasks 10 times.",
        });
      }

      // Deduct one from the edit/delete limit
      userObject.guestEditLimit -= 1;
      await userObject.save();
    }

    // Delete the task
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

    // Find the authenticated user
    const userObject = await User.findById(req.user);

    if (!userObject) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Increment streak and delete task
    userObject.streak += 1;
    await Promise.all([userObject.save(), task.deleteOne()]);

    return res.status(200).json({
      success: true,
      message: "Task marked as done and streak updated successfully!",
    });
  } catch (err) {
    console.error("Error marking task as done:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};
