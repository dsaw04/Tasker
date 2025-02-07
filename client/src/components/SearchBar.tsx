import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchBarProps {
  onSearch: (query: string) => void; 
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div
      className="flex justify-center tooltip tooltip-bottom m-2"
      data-tip="Search for a task."
    >
      <label className="input input-bordered items-center rounded-3xl flex gap-2 w-[80%] bg-white text-zinc-900">
        <input
          type="text"
          placeholder="Search"
          onChange={handleInputChange}
          className="grow text-zinc-900 font-sans"
        />
        <FontAwesomeIcon icon={faSearch} />
      </label>
    </div>
  );
}
