import { useMemo, useRef } from "react";
import { format, startOfWeek, addDays, addWeeks, isToday } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";

type DateSliderProps = {
  taskDates: string[]; // Array of dates with tasks, in "yyyy-MM-dd" format
  onDateSelect: (date: string | null) => void;
  selectedDate: string | null;
};

const DateSlider: React.FC<DateSliderProps> = ({
  taskDates,
  onDateSelect,
  selectedDate,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Generate dates: current week + 3 weeks in advance
  const weeks = useMemo(() => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 4 }).map((_, weekIndex) => {
      return Array.from({ length: 7 }).map((_, dayIndex) => {
        return addDays(addWeeks(startDate, weekIndex), dayIndex);
      });
    });
  }, []);

  // Handle scrolling via buttons
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth; // Scroll by the width of the slider
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  // Handle date clicks
  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    if (selectedDate === formattedDate) {
      onDateSelect(null); // Unselect if clicked again
    } else {
      onDateSelect(formattedDate); // Set selected date
    }
  };

  return (
    <div className="relative">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory p-4 rounded-lg scrollbar-hide"
      >
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="flex flex-shrink-0 snap-center space-x-2 w-full justify-around"
          >
            {week.map((date) => {
              const formattedDate = format(date, "yyyy-MM-dd");
              const hasTasks = taskDates.includes(formattedDate);
              const isSelected = selectedDate === formattedDate;

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`cursor-pointer flex flex-col items-center justify-center w-14 h-14 rounded-full text-sm ${
                    isToday(date)
                      ? "bg-orange-100"
                      : isSelected
                      ? "bg-blue-200"
                      : "bg-white"
                  }`}
                  title={formattedDate}
                >
                  <div>{format(date, "EEE")}</div>
                  <div
                    className={`${
                      hasTasks
                        ? "underline decoration-yellow-500 decoration-4"
                        : ""
                    } ${isSelected ? "font-bold text-blue-400" : ""}`}
                  >
                    {format(date, "dd")}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className="tooltip tooltip-bottom absolute top-1/2 transform -translate-y-1/2 text-white w-10 h-10 rounded-full flex items-center justify-center"
        data-tip="Scroll to this week."
      >
        <FontAwesomeIcon
          icon={faArrowAltCircleLeft}
          className="text-zinc-900"
        />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 tooltip tooltip-bottom top-1/2 transform -translate-y-1/2 text-white w-10 h-10 rounded-full flex items-center justify-center"
        data-tip="Scroll for more days."
      >
        <FontAwesomeIcon
          icon={faArrowAltCircleRight}
          className="text-zinc-900"
        />
      </button>
    </div>
  );
};

export default DateSlider;
