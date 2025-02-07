import React, { useState } from "react";
import Task from "./Task";
import { TaskType } from "../../types/TaskType";

interface TaskListProps {
  tasks: TaskType[];
  onDelete: (taskId: string, taskName: string) => void;
  onUpdate: (
    taskId: string,
    taskName: string,
    taskDate: Date,
    taskStatus: string
  ) => void;
  onMarkDone: (taskId: string, taskName: string) => void;
}

export default function TaskList({
  tasks,
  onDelete,
  onUpdate,
  onMarkDone,
}: TaskListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Check if screen size is mobile
  const isMobile = window.innerWidth < 768;

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = isMobile ? tasks : tasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="task-list min-h-screen flex flex-col justify-between">
      <div className="flex-grow h-fit">
        {currentTasks.map((task) => (
          <div
            key={task._id}
            className="my-5 transform transition-transform duration-200 ease-in-out hover:-translate-y-1"
          >
            <Task
              taskId={task._id}
              title={task.description}
              date={task.date}
              status={task.status}
              isOverdue={task.isOverdue}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onMarkDone={onMarkDone}
            />
          </div>
        ))}
      </div>

      {/* Pagination (Disabled on Mobile) */}
      {!isMobile && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 w-full bg-white py-4 shadow-md hidden md:flex">
          <div className="flex justify-center items-center w-full">
            <div className="join">
              <button
                className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn ${currentPage === i + 1 ? "btn-active" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className={`join-item btn ${currentPage === totalPages ? "btn-disabled" : ""}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
