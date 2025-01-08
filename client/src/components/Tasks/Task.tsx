"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { TaskStatus } from "../../types/TaskType";

interface TaskProps {
  taskId: string;
  title: string;
  date: Date;
  status: TaskStatus;
  isOverdue: boolean;
  onDelete: (taskId: string, taskName: string) => void;
  onUpdate: (
    taskId: string,
    taskName: string,
    taskDate: Date,
    taskStatus: TaskStatus
  ) => void;
  onMarkDone: (taskId: string, taskName: string) => void; // Added onMarkDone prop
}

export default function Task({
  taskId,
  title,
  date,
  status,
  isOverdue,
  onDelete,
  onUpdate,
  onMarkDone,
}: TaskProps) {
  const formatDate = (date: Date | string) => {
    try {
      const parsedDate = new Date(date); // Ensure `date` is converted to a Date object
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date"); // Throw error if `parsedDate` is invalid
      }
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return new Intl.DateTimeFormat("en-UK", options).format(parsedDate);
    } catch (err) {
      console.error("Invalid date value:", date, err);
      return "Invalid Date";
    }
  };

  const capitalizeStatus = (status: string): string => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  return (
    <div
      className={`task-item w-full flex shadow-xl gap-2 border border-gray-200 rounded-3xl`}
    >
      <div
        className={`w-[2%] ${
          isOverdue
            ? "bg-red-400"
            : status === "to-do"
            ? "bg-yellow-400"
            : "bg-green-400"
        } rounded-l-3xl`}
      ></div>
      <div className="justify-between pl-2 p-4 flex w-full">
        <div>
          <h3 className="font-lexend font-medium text-xl text-zinc-900">
            {title}
          </h3>
          <p className="text-gray-600">{formatDate(date)}</p>
          {isOverdue ? (
            <p className="text-red-500">Overdue</p>
          ) : (
            <p
              className={`status ${
                status === "to-do" ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {capitalizeStatus(status)}
            </p>
          )}
        </div>
        <div className="flex self-center justify-self-end gap-2">
          {/* Mark Done Button */}
          <button
            onClick={() => onMarkDone(taskId, title)}
            className="transition-transform duration-100 ease-in-out transform hover:scale-105"
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="p-2 border rounded-lg hover:border-2 text-green-500"
            />
          </button>
          {/* Update Button */}
          <button
            onClick={() => onUpdate(taskId, title, date, status)}
            className="transition-transform duration-100 ease-in-out transform hover:scale-105"
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="p-2 border rounded-lg hover:border-2"
            />
          </button>
          {/* Delete Button */}
          <button
            onClick={() => onDelete(taskId, title)}
            className="transition-transform duration-100 ease-in-out transform hover:scale-105"
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              className="p-2 border rounded-lg hover:border-2 text-red-500"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
