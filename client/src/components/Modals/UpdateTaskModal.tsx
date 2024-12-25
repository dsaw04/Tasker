import Modal from "./Modal";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import { TaskType } from "../../types/TaskType";
import getMinDateTime from "../../utils/getMinDateTime";

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
  const { formData, isSubmitting, handleChange, handleSubmit, resetForm } =
    useUpdateTask(task, () => {
      onSuccess(); // Refresh the task list
      handleClose(); // Close the modal when update is successful
    });

  const handleClose = () => {
    resetForm(); // Reset form state on close
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-bold mb-4 text-zinc-900">Update Task</h2>
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
            min={getMinDateTime()} // Prevent setting date/time in the past
          />
        </label>

        <label className="pb-6">
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
            {isSubmitting ? "Updating..." : "Update Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
