import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { useDeleteTask } from "./hooks/useDeleteTask";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";
import AddTaskForm from "./components/AddTaskForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function App() {
  const { tasks, loading, error, refetch } = useTasks();

  // State to manage the modal content and visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"add" | "delete" | null>(
    null
  );

  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { isDeleting, deleteTask } = useDeleteTask(refetch); // Hook for delete logic

  // Functions to handle modal opening
  const handleOpenAddModal = () => {
    setModalContent("add");
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (taskId: string, taskName: string) => {
    setSelectedTask({ id: taskId, title: taskName });
    setModalContent("delete");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-white items-center flex flex-col">
      <div className="w-[85%]">
        {/* Header */}
        <div className="flex items-center flex-col pb-6">
          <h1 className="pt-8 pb-4 font-lexend font-medium text-6xl text-zinc-900">
            tasker
          </h1>
          <h2 className="font-lexend font-medium text-lg text-zinc-900">
            sort out your life
          </h2>
        </div>

        {/* Add Task Button */}
        <div className="py-8 flex items-center justify-between">
          <h1 className="font-lexend font-semibold text-4xl text-zinc-900">
            Upcoming
          </h1>
          <button
            onClick={handleOpenAddModal}
            className="flex justify-center items-center w-10 h-10 rounded-full border hover:bg-gray-200"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Task List */}
        <div>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <TaskList tasks={tasks} onDelete={handleOpenDeleteModal} />
          )}
        </div>

        {/* Dynamic Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent === "add" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-zinc-900">
                Add a new task
              </h2>
              <AddTaskForm onSuccess={refetch} onClose={handleCloseModal} />
            </>
          )}

          {modalContent === "delete" && selectedTask && (
            <>
              <h2 className="text-xl font-bold mb-4 text-zinc-900">
                Delete Task
              </h2>
              <p>
                This action will permanently delete the task{" "}
                <strong>'{selectedTask.title}'</strong>. Are you sure?
              </p>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={handleCloseModal}
                  className="border px-4 py-2 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteTask(selectedTask.id); // Call delete hook
                    handleCloseModal();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
