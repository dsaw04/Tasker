import { useEffect, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { useSearchTask } from "./hooks/useSearchTask"; // Hook for real-time search
import { useDeleteTask } from "./hooks/useDeleteTask";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";
import AddTaskForm from "./components/AddTaskForm";
import UpdateTaskModal from "./components/UpdateTaskModal";
import SearchBar from "./components/SearchBar";
import { sortTasks } from "./utils/sortTasks"; // Import sorting utility
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSortDown } from "@fortawesome/free-solid-svg-icons";

function App() {
  const { tasks, loading, error, refetch } = useTasks();
  const { results, searchTasks } = useSearchTask(); // Hook for real-time search
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [sortOption, setSortOption] = useState("chronological"); // Default sort option

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
      setFilteredTasks(sortTasks(tasks, sortOption)); // Reset to all tasks if query is empty
    } else {
      searchTasks(query);
    }
  };

  // Update filtered tasks on search and sort changes
  useEffect(() => {
    const tasksToDisplay = results.length ? results : tasks;
    setFilteredTasks(sortTasks(tasksToDisplay, sortOption));
  }, [results, tasks, sortOption]);

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
        <SearchBar onSearch={handleSearch} />

        {/* Add Task and Sort Dropdown */}
        <div className="py-8 flex items-center justify-between">
          <h1 className="font-lexend font-semibold text-4xl text-zinc-900">
            Upcoming
          </h1>
          <div className="flex gap-2 relative">
            <button
              onClick={handleOpenAddModal}
              className="flex justify-center items-center w-10 h-10 rounded-full border hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>

            <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex justify-center items-center w-10 h-10 rounded-full border hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faSortDown} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a
                    onClick={() => setSortOption("chronological")}
                    className={`cursor-pointer flex items-center ${
                      sortOption === "chronological" ? "font-bold" : ""
                    }`}
                  >
                    Chronological
                    {sortOption === "chronological" && (
                      <span className="text-green-500 mr-2">✔</span>
                    )}
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSortOption("priority")}
                    className={`cursor-pointer flex items-center ${
                      sortOption === "priority" ? "font-bold" : ""
                    }`}
                  >
                    Priority
                    {sortOption === "priority" && (
                      <span className="text-green-500 mr-2">✔</span>
                    )}
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSortOption("alphabetical")}
                    className={`cursor-pointer flex items-center ${
                      sortOption === "alphabetical" ? "font-bold" : ""
                    }`}
                  >
                    Alphabetical
                    {sortOption === "alphabetical" && (
                      <span className="text-green-500 mr-2">✔</span>
                    )}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <TaskList
              tasks={filteredTasks} // Render filtered tasks
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
