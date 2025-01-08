import { useState } from "react";
import { TaskType } from "../types/TaskType";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    "add" | "delete" | "update" | "mark-done" | null
  >(null);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const openModal = (
    type: "add" | "delete" | "update" | "mark-done",
    task: TaskType | null = null
  ) => {
    setModalContent(type);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedTask(null);
  };

  return { isModalOpen, modalContent, selectedTask, openModal, closeModal };
};
