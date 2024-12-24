import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { useSearchTask } from "./hooks/useSearchTask"; // Hook for real-time search
import { useDeleteTask } from "./hooks/useDeleteTask";
import TaskList from "./components/Tasks/TaskList";
import Modal from "./components/Modals/Modal";
import AddTaskForm from "./components/Modals/AddTaskForm";
import UpdateTaskModal from "./components/Modals/UpdateTaskModal";
import SearchBar from "./components/SearchBar";
import { useSortTasks } from "./hooks/useSortTasks";
import Header from "./components/Header/Header";
import { useFilteredTasks } from "./hooks/useFilteredTasks";

function App() {
  const { tasks, loading, error, refetch } = useTasks();
  const { results, searchTasks, resetResults } = useSearchTask();
  const [sortOption, setSortOption] = useState("chronological");

  const filteredTasks = useFilteredTasks(tasks, results);
  const sortedTasks = useSortTasks(filteredTasks, sortOption);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    "add" | "delete" | "update" | null
  >(null);

  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    description: string;
    date: string;
    status: string;
  } | null>(null);

  const { isDeleting, deleteTask } = useDeleteTask(refetch);

  // Open Add Task Modal
  const handleOpenAddModal = () => {
    setModalContent("add");
    setIsModalOpen(true);
  };

  // Open Delete Task Modal
  const handleOpenDeleteModal = (taskId: string, taskDescription: string) => {
    setSelectedTask({
      id: taskId,
      description: taskDescription,
      date: "",
      status: "",
    });
    setModalContent("delete");
    setIsModalOpen(true);
  };

  // Open Update Task Modal
  const handleOpenUpdateModal = (
    taskId: string,
    description: string,
    date: string,
    status: string
  ) => {
    setSelectedTask({ id: taskId, description, date, status });
    setModalContent("update");
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedTask(null);
  };

  // Handle Search
  const handleSearch = (query: string) => {
    if (!query) {
      resetResults(); // Clear search results when query is empty
    } else {
      searchTasks(query);
    }
  };

  return (
    <div className="min-h-screen bg-white items-center flex flex-col">
      <div className="w-[85%]">
        <div className="flex items-center flex-col pb-6">
          <h1 className="pt-8 pb-4 font-lexend font-medium text-6xl text-zinc-900">
            tasker
          </h1>
          <h2 className="font-lexend font-medium text-lg text-zinc-900">
            sort out your life
          </h2>
        </div>

        <SearchBar onSearch={handleSearch} />

        <Header
          sortOption={sortOption}
          setSortOption={setSortOption}
          onAddTask={handleOpenAddModal}
        />

        {/* Task List */}
        <div>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <TaskList
              tasks={sortedTasks} // Render filtered tasks
              onDelete={handleOpenDeleteModal}
              onUpdate={handleOpenUpdateModal}
            />
          )}
        </div>

        {/* Dynamic Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent === "add" && (
            <AddTaskForm onSuccess={refetch} onClose={handleCloseModal} />
          )}
          {modalContent === "delete" && selectedTask && (
            <>
              <h2 className="text-xl font-bold mb-4 text-zinc-900">
                Delete Task
              </h2>
              <p>
                This action will permanently delete the task{" "}
                <strong>'{selectedTask.description}'</strong>. Are you sure?
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
                    await deleteTask(selectedTask.id);
                    refetch();
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
          {modalContent === "update" && selectedTask && (
            <UpdateTaskModal
              isOpen={isModalOpen}
              task={{
                id: selectedTask.id,
                description: selectedTask.description,
                date: selectedTask.date,
                status: selectedTask.status,
              }}
              onSuccess={refetch}
              onClose={handleCloseModal}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
