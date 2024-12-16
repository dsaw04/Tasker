import Task from "./Task";

interface TaskType {
  _id: string;
  description: string;
  date: Date;
  status: string;
}

interface TaskListProps {
  tasks: TaskType[];
  onDelete: (taskId: string, taskName: string) => void;
  onUpdate: (
    taskId: string,
    taskName: string,
    taskDate: string,
    taskStatus: string
  ) => void;
}

export default function TaskList({ tasks, onDelete, onUpdate }: TaskListProps) {
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="task-list">
      {sortedTasks.map((task) => (
        <div
          key={task._id}
          className="my-4 transform transition-transform duration-200 ease-in-out hover:-translate-y-1"
        >
          <Task
            taskId={task._id}
            title={task.description}
            date={task.date}
            status={task.status}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  );
}
