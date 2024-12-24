import { useAddTask } from "../../hooks/useAddTask";

interface AddTaskFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AddTaskForm({ onSuccess, onClose }: AddTaskFormProps) {
  const { formData, isSubmitting, handleChange, handleSubmit, resetForm } =
    useAddTask(() => {
      onSuccess();
      onClose();
    });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Function to get current date and time in the required format (YYYY-MM-DDTHH:MM)
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label>
        <span className="label-text text-zinc-900 font-semibold">
          Task Description
        </span>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border w-full p-2 rounded"
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
          className="border p-2 rounded w-full"
          min={getMinDateTime()} // Set minimum selectable date and time to now
        />
      </label>

      <label className="pb-6">
        <span className="label-text text-zinc-900 font-semibold">
          Nature of the task
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
          onClick={handleClose}
          className="border px-4 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
