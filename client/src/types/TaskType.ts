export type TaskStatus = "to-do" | "check-in" | "overdue";

export interface TaskType {
  _id: string;
  description: string;
  date: Date;
  status: TaskStatus;
  isOverdue: boolean;
}
