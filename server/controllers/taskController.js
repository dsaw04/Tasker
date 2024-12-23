import Task from "../models/taskModel.js";

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

    const taskExist = await Task.findOne({ description });
    if (taskExist) {
      return res.status(400).json({
        success: false,
        message: "Duplicate task exists.",
      });
    }

    const newTask = new Task({ description, date, status });
    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: savedTask,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    if (!tasks.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully.",
      data: tasks,
    });
  } catch (err) {
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

    const searchCriteria = {};
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

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: updatedTask,
    });
  } catch (err) {
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

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: err.message,
    });
  }
};
