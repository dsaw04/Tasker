import React, { memo } from "react";
import LogoutButton from "./LogoutButton";
import { Player } from "@lottiefiles/react-lottie-player";

export interface HeaderProps {
  streak: number | null;
  loading: boolean;
  error: string | null;
  refetchStreak: () => void;
}

const Logo: React.FC = memo(() => (
  <img
    src="/assets/tasker-logo-black.svg"
    alt="Tasker Alt"
    className="w-[7%] h-auto"
    draggable="false"
  />
));

const StreakDisplay: React.FC<HeaderProps> = ({
  streak,
  loading,
  error,
  refetchStreak,
}) => {
  const getAnimationSource = () => {
    if (streak === null || streak < 50) return "/animations/Streak.json";
    if (streak < 100) return "/animations/Streak-Orange.json";
    if (streak < 500) return "/animations/Streak-Red.json";
    return "/animations/Streak-Blue.json";
  };

  // don't render anything until streak is non-null
  if (streak === null && loading) return null;

  if (error)
    return (
      <div className="flex items-center gap-2">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={refetchStreak}
          className="bg-primary text-white px-3 py-1 rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="flex items-center gap-1 transition-all duration-300 ease-in-out">
      <Player autoplay loop src={getAnimationSource()} style={{ height: 50 }} />
      <p className="text-xl font-medium">{streak}</p>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  streak,
  loading,
  error,
  refetchStreak,
}) => (
  <div className="flex w-full mt-2 justify-between items-center">
    <Logo />
    <div className="flex items-center gap-12">
      <StreakDisplay
        streak={streak}
        loading={loading}
        error={error}
        refetchStreak={refetchStreak}
      />
      <LogoutButton />
    </div>
  </div>
);

export default Header;
