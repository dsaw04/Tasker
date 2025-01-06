import React, { useRef, useEffect } from "react";

interface SortDropdownProps {
  isOpen: boolean;
  onSort: (sortOption: string) => void;
  toggleDropdown: (state: boolean) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  isOpen,
  onSort,
  toggleDropdown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, toggleDropdown]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 bg-white shadow-lg rounded-md border p-2 z-50"
    >
      <button
        onClick={() => onSort("chronological")}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Chronological
      </button>
      <button
        onClick={() => onSort("priority")}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Priority
      </button>
      <button
        onClick={() => onSort("alphabetical")}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Alphabetical
      </button>
    </div>
  );
};

export default SortDropdown;
