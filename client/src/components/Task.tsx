"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface TaskProps {
  taskId: string;
  title: string;
  date: Date;
  status: string;
  onDelete: (taskId: string, taskName: string) => void; // Handler for delete action
}

export default function Task({
  taskId,
  title,
  date,
  status,
  onDelete,
}: TaskProps) {
  // Function to format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-UK", options).format(date);
  };

  return (
    <div className="task-item w-full p-4 shadow-xl justify-between gap-2 flex border border-gray-200 rounded-3xl">
      <div className="">
        <h3 className="font-lexend font-medium text-xl text-zinc-900">
          {title}
        </h3>
        <p className="text-gray-600">{formatDate(new Date(date))}</p>
        <p
          className={`status ${
            status === "To-do" ? "text-red-500" : "text-green-500"
          }`}
        >
          {status}
        </p>
      </div>
      <div className="flex self-center justify-self-end gap-2">
        <button className="transition-transform duration-100 ease-in-out transform hover:scale-105">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="p-2 border rounded-lg hover:border-2"
          />
        </button>
        <button
          onClick={() => onDelete(taskId, title)} // Call delete handler
          className="transition-transform duration-100 ease-in-out transform hover:scale-105"
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            className="p-2 border rounded-lg hover:border-2 text-red-500"
          />
        </button>
      </div>
    </div>
  );
}
