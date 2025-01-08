import LogoutButton from "./LogoutButton";
import { Player } from "@lottiefiles/react-lottie-player";

interface HeaderProps {
  streak: number | null;
  loading: boolean;
  error: string | null;
}

function Header({ streak, loading, error }: HeaderProps) {
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
      </div>
    );
  }

  return (
    <div className="flex w-full mt-2 justify-end items-center gap-12">
      <div className="flex items-center gap-1">
        <Player
          autoplay
          loop
          src={getAnimationSource()}
          style={{ height: "50px" }} // Adjust size
        />
        <p className="text-xl font-medium">{streak}</p>
      </div>
      <LogoutButton />
    </div>
  );
}

export default Header;
