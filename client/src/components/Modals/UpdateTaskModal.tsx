import Modal from "./Modal";
import { useState, useEffect } from "react";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import { TaskType, TaskStatus } from "../../types/TaskType";

interface UpdateTaskModalProps {
  isOpen: boolean;
  task: TaskType;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh the tasks
}

export default function UpdateTaskModal({
  isOpen,
  task,
  onClose,
  onSuccess,
}: UpdateTaskModalProps) {
  const { isUpdating, updateTask } = useUpdateTask(onSuccess);

  const [formData, setFormData] = useState({
    description: "",
    date: new Date(),
    status: "to-do" as TaskStatus,
  });

  // Populate form data when modal opens
  useEffect(() => {
    if (task) {
      const localDate = new Date(
        task.date.getTime() - task.date.getTimezoneOffset() * 60000
      ); // Adjust for local timezone
      setFormData({
        description: task.description,
        date: localDate, // Keep as a Date object
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "date" ? new Date(value) : value, // Convert date to a Date object
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(task._id, formData); // `formData` now matches the expected types
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-zinc-900">Update Task</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          <span className="label-text text-zinc-900 font-semibold">
            Task Description
          </span>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </label>
        <label>
          <span className="label-text text-zinc-900 font-semibold">
            Date and Time
          </span>
          <input
            type="datetime-local"
            name="date"
            value={formData.date.toISOString().slice(0, 16)} // Convert Date object to string for input
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)} // Always ensure UTC min value
            className="border p-2 rounded w-full"
          />
        </label>
        <label>
          <span className="label-text text-zinc-900 font-semibold">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="to-do">To-do</option>
            <option value="check-in">Check-in</option>
            <option value="done">Done</option>
          </select>
        </label>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
