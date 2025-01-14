import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSortDown } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  sortOption: string; // Current sorting option
  setSortOption: (sortOption: string) => void; // Callback to update sorting
  onAddTask: () => void; // Callback to open "Add Task" modal
}

function Header({ sortOption, setSortOption, onAddTask }: HeaderProps) {
  return (
    <div className="py-8 flex items-center justify-between">
      <h1 className="font-lexend font-semibold text-4xl text-zinc-900">
        Upcoming
      </h1>
      <div className="flex gap-2 relative">
        <button
          onClick={onAddTask}
          className="flex justify-center items-center w-10 h-10 rounded-full border hover:bg-gray-200 tooltip tooltip-bottom"
          data-tip="Add a task."
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex justify-center items-center w-10 h-10 rounded-full border hover:bg-gray-200"
          >
            <FontAwesomeIcon icon={faSortDown} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <a
                onClick={() => setSortOption("chronological")}
                className={`cursor-pointer flex justify-between items-center ${
                  sortOption === "chronological" ? "font-bold" : ""
                }`}
              >
                <span>Chronological</span>
                {sortOption === "chronological" && (
                  <span className="text-green-500">✔</span>
                )}
              </a>
            </li>
            <li>
              <a
                onClick={() => setSortOption("priority")}
                className={`cursor-pointer flex justify-between items-center ${
                  sortOption === "priority" ? "font-bold" : ""
                }`}
              >
                <span>Priority</span>
                {sortOption === "priority" && (
                  <span className="text-green-500">✔</span>
                )}
              </a>
            </li>
            <li>
              <a
                onClick={() => setSortOption("alphabetical")}
                className={`cursor-pointer flex justify-between items-center ${
                  sortOption === "alphabetical" ? "font-bold" : ""
                }`}
              >
                <span>Alphabetical</span>
                {sortOption === "alphabetical" && (
                  <span className="text-green-500">✔</span>
                )}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
