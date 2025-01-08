import LogoutButton from "./LogoutButton";
import { Player } from "@lottiefiles/react-lottie-player";

function Header({ streak }: { streak: number }) {
  return (
    <div className="flex w-full mt-2 justify-end items-center gap-12">
      <div className="flex items-center gap-1">
        {streak >= 0 && streak < 50 && (
          <Player
            autoplay
            loop
            src="/animations/Streak.json" // Correct path
            style={{ height: "50px" }} // Adjust size
          />
        )}
        {streak >= 50 && streak < 100 && (
          <Player
            autoplay
            loop
            src="/animations/Streak-Orange.json" // Correct path
            style={{ height: "50px" }} // Adjust size
          />
        )}
        {streak >= 100 && streak < 500 && (
          <Player
            autoplay
            loop
            src="/animations/Streak-Red.json" // Correct path
            style={{ height: "50px" }} // Adjust size
          />
        )}
        {streak >= 500 && (
          <Player
            autoplay
            loop
            src="/animations/Streak-Blue.json" // Correct path
            style={{ height: "50px" }} // Adjust size
          />
        )}
        <p className="text-xl font-medium">{streak}</p>
      </div>
      <LogoutButton />
    </div>
  );
}

export default Header;
