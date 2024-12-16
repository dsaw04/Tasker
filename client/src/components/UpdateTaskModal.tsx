import { useState, useEffect } from "react";
import { useUpdateTask } from "../hooks/useUpdateTask";

interface UpdateTaskModalProps {
  isOpen: boolean;
  task: { id: string; description: string; date: string; status: string };
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
    date: "",
    status: "to-do",
  });

  // Populate form data when modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description,
        date: task.date,
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(task.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
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
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)} // Block past times
              className="border p-2 rounded w-full"
            />
          </label>
          <label>
            <span className="label-text text-zinc-900 font-semibold">
              Status
            </span>
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
      </div>
    </div>
  );
}
