import Modal from "./Modal";
import { useMarkDone } from "../../hooks/useMarkDone";

interface MarkDoneModalProps {
  isOpen: boolean;
  taskId: string;
  taskName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MarkDoneModal({
  isOpen,
  taskId,
  taskName,
  onClose,
  onSuccess,
}: MarkDoneModalProps) {
  const { isMarking, markDone } = useMarkDone(onSuccess);

  const handleMarkDone = async () => {
    await markDone(taskId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-zinc-900 mb-4">
        Mark Task as Done
      </h2>
      <p className="text-zinc-900 mb-6">
        Are you sure you want to mark the task{" "}
        <span className="font-bold">{taskName}</span> as done? This action
        cannot be undone.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="border px-4 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleMarkDone}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={isMarking}
        >
          {isMarking ? "Marking..." : "Mark Done"}
        </button>
      </div>
    </Modal>
  );
}
