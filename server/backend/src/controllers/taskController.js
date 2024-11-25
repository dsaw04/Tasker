import Task from "../model/taskModel.js";

export const create = async (req, res) => {
  try {
    const { description, date, status } = req.body;

    if (!description || !date) {
      return res
        .status(400)
        .json({ message: "Description and date are required." });
    }

    const taskExist = await Task.findOne({ description });
    if (taskExist) {
      return res.status(400).json({ message: "Duplicate task exists." });
    }

    // Create a new task
    const newTask = new Task({ description, date, status });
    const savedData = await newTask.save();

    // Return the saved task
    res.status(201).json(savedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error occurred.", error: error.message });
  }
};
