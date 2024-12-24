export type TaskStatus = "to-do" | "check-in" | "done";

export interface TaskType {
  _id: string;
  description: string;
  date: Date;
  status: TaskStatus;
}
