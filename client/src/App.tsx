import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { useSearchTask } from "./hooks/useSearchTask";
import TaskList from "./components/Tasks/TaskList";
import Modal from "./components/Modals/Modal";
import AddTaskModal from "./components/Modals/AddTaskModal";
import UpdateTaskModal from "./components/Modals/UpdateTaskModal";
import DeleteTaskModal from "./components/Modals/DeleteTaskModal";
import SearchBar from "./components/SearchBar";
import { useSortTasks } from "./hooks/useSortTasks";
import Header from "./components/Header/Header";
import { useFilteredTasks } from "./hooks/useFilteredTasks";
import { useModal } from "./hooks/useModal";
import { TaskStatus } from "./types/TaskType";
import ErrorController from "./components/ErrorController";

function App() {
  const { tasks, loading, error, refetch } = useTasks();
  const { results, searchTasks, resetResults, searchError } = useSearchTask();
  const [sortOption, setSortOption] = useState("chronological");

  const filteredTasks = useFilteredTasks(tasks, results);
  const sortedTasks = useSortTasks(filteredTasks, sortOption);

  const { isModalOpen, modalContent, selectedTask, openModal, closeModal } =
    useModal();

  const handleSearch = (query: string) => {
    if (!query) {
      resetResults();
    } else {
      searchTasks(query);
    }
  };

  return (
    <div className="min-h-screen bg-white items-center flex flex-col">
      <div className="w-[85%] max-w-4xl">
        {/* Header */}
        <div className="flex items-center flex-col pb-6">
          <h1 className="pt-8 pb-4 font-lexend font-medium text-6xl text-zinc-900">
            tasker
          </h1>
          <h2 className="font-lexend font-medium text-lg text-zinc-900">
            sort out your life
          </h2>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Header Actions */}
        <Header
          sortOption={sortOption}
          setSortOption={setSortOption}
          onAddTask={() => openModal("add")}
        />

        {/* Task List */}
        <div>
          {loading && <p>Loading tasks...</p>}
          {error && <ErrorController code={error} />}
          {searchError && !error && <ErrorController code={searchError} />}
          {!loading && !error && !searchError && (
            <TaskList
              tasks={sortedTasks}
              onDelete={(id, description) => {
                openModal("delete", {
                  _id: id,
                  description,
                  date: new Date(),
                  status: "to-do",
                });
              }}
              onUpdate={(id, description, date: Date, status) => {
                openModal("update", {
                  _id: id,
                  description,
                  date,
                  status: status as TaskStatus,
                });
              }}
            />
          )}
        </div>

        {/* Modals */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalContent === "add" && (
            <AddTaskModal
              isOpen={isModalOpen}
              onSuccess={refetch}
              onClose={closeModal}
            />
          )}
          {modalContent === "delete" && selectedTask && (
            <DeleteTaskModal
              isOpen={isModalOpen}
              taskId={selectedTask._id}
              taskName={selectedTask.description}
              onClose={closeModal}
              onSuccess={refetch}
            />
          )}
          {modalContent === "update" && selectedTask && (
            <UpdateTaskModal
              isOpen={isModalOpen}
              task={selectedTask}
              onClose={closeModal}
              onSuccess={refetch}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
