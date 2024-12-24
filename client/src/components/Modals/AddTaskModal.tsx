import Modal from "./Modal";
import { useAddTask } from "../../hooks/useAddTask";
import getMinDateTime from "../../utils/getMinDateTime";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTaskModalProps) {
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
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-bold mb-4 text-zinc-900">Add a New Task</h2>
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
            min={getMinDateTime()}
          />
        </label>

        <label className="pb-6">
          <span className="label-text text-zinc-900 font-semibold">
            Nature of the Task
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
    </Modal>
  );
}
