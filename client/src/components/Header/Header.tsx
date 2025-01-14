import LogoutButton from "./LogoutButton";
import { Player } from "@lottiefiles/react-lottie-player";

interface HeaderProps {
  streak: number | null;
  loading: boolean;
  error: string | null;
  refetchStreak: () => void; // New prop to refresh streak
}

function Header({ streak, loading, error, refetchStreak }: HeaderProps) {
  const getAnimationSource = (): string => {
    if (streak === null || streak < 50) return "/animations/Streak.json";
    if (streak >= 50 && streak < 100) return "/animations/Streak-Orange.json";
    if (streak >= 100 && streak < 500) return "/animations/Streak-Red.json";
    if (streak >= 500) return "/animations/Streak-Blue.json";

    return "/animations/Streak.json";
  };

  if (loading) {
    return (
      <div className="flex w-full mt-2 justify-end items-center gap-12">
        <p>Loading streak...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full mt-2 justify-end items-center gap-12">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={refetchStreak}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full mt-2 justify-between items-center">
      <img
        src="/assets/tasker-logo-black.svg"
        alt="Tasker Alt"
        className="w-[7%] h-auto justify-self-start"
        draggable="false"
      />
      <div className="gap-12 flex items-center">
        <div className="flex items-center gap-1">
          <Player
            autoplay
            loop
            src={getAnimationSource()}
            style={{ height: "50px" }}
          />
          <p className="text-xl font-medium">{streak}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}

export default Header;
