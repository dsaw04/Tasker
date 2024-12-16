export type Task = {
  title: string;
  date: Date;
  status: string;
};

const tasks: Task[] = [
  {
    title: "Submit Project",
    date: new Date("2024-01-01"),
    status: "To-do",
  },
  {
    title: "Do the Hawk Tuah",
    date: new Date("2024-01-01"),
    status: "To-do",
  },
  {
    title: "Mango Mango Mango",
    date: new Date("2024-01-01"),
    status: "To-do",
  },
  {
    title: "Bomborasclaat",
    date: new Date("2024-01-01"),
    status: "To-do",
  },
  {
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2024-01-01"),
    status: "To-do",
  },
];

export default tasks;
