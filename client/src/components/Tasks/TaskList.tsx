import Task from "./Task";
import { TaskType } from "../../types/TaskType";

interface TaskListProps {
  tasks: TaskType[];
  onDelete: (taskId: string, taskName: string) => void;
  onUpdate: (
    taskId: string,
    taskName: string,
    taskDate: Date,
    taskStatus: string,
  ) => void;
  onMarkDone: (taskId: string, taskName: string) => void;
}

export default function TaskList({ tasks, onDelete, onUpdate , onMarkDone}: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
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
            onMarkDone = {onMarkDone}
          />
        </div>
      ))}
    </div>
  );
}
