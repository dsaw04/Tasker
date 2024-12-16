import Task from "./Task";

interface TaskType {
  _id: string;
  description: string;
  date: Date;
  status: string;
}

interface TaskListProps {
  tasks: TaskType[];
  onDelete: (taskId: string, taskName: string) => void; // Added onDelete prop
}

export default function TaskList({ tasks, onDelete }: TaskListProps) {
  // Sort tasks by date: closest to the present at the top
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

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
            onDelete={onDelete} // Pass onDelete handler to Task
          />
        </div>
      ))}
    </div>
  );
}
