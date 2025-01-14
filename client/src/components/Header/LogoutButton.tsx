import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from AuthContext
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-2 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 h-fit w-fit"
    >
      Logout <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </button>
  );
};

export default LogoutButton;
