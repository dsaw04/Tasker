import { useAddTask } from "../hooks/useAddTask";

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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Task Description"
        className="border p-2 rounded"
      />
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="to-do">To-do</option>
        <option value="check-in">Check-in</option>
        <option value="done">Done</option>
      </select>
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
