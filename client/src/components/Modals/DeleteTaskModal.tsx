import Modal from "./Modal";
import { useDeleteTask } from "../../hooks/useDeleteTask";

interface DeleteTaskModalProps {
  isOpen: boolean;
  taskId: string;
  taskName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteTaskModal({
  isOpen,
  taskId,
  taskName,
  onClose,
  onSuccess,
}: DeleteTaskModalProps) {
  const { isDeleting, deleteTask } = useDeleteTask(onSuccess);

  const handleDelete = async () => {
    await deleteTask(taskId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-zinc-900 mb-4">Delete Task</h2>
      <p className="text-zinc-900 mb-6">
        This action will permanently delete the task{" "}
        <span className="font-bold">{taskName}</span>. Are you sure?
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="border px-4 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
