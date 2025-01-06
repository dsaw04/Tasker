import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TextField } from "@mui/material";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Blobs } from "../components/Blobs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loginAsGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Disable the button while registering
    try {
      await register(username, email, password);
      navigate("/verify"); // Navigate to the verification page after successful registration
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Re-enable the button
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      navigate("/");
      toast.success("Logged in as a guest!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to log in as a guest. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Left Side with Blobs and Logo */}
      <div className="absolute top-0 left-0 w-[40%] h-full z-10">
        <Blobs />
      </div>
      <div className="absolute top-4 left-6 z-20">
        <h1 className="text-white font-extrabold text-[35px] font-lexend">
          tasker
        </h1>
      </div>

      {/* Right Side with Form */}
      <div className="absolute top-0 left-1/3 w-2/3 h-screen bg-white rounded-l-[40px] z-20 flex justify-center">
        <div className="w-[85%] gap-2 flex flex-col mt-12">
          <h1 className="text-5xl font-lexend font-bold text-zinc-900 mb-3">
            Start your journey,
          </h1>
          <div className="mt-12">
            <form onSubmit={handleRegister}>
              <div className="space-y-8">
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className={`w-full py-3 text-white text-xl font-semibold rounded-xl transition duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-forestGreen"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                  {
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      className="text-white ml-2"
                    />
                  }
                </button>
              </div>
            </form>
          </div>

          {/* Add Login Redirect Button */}
          <p className="mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-secondary hover:text-primary">
              Login
            </a>
          </p>

          <div className="flex items-center justify-center mt-4 mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-zinc-900 font-medium">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-3 bg-secondary text-white text-xl rounded-xl hover:bg-primary transition duration-200"
          >
            Continue as Guest
            {<FontAwesomeIcon icon={faUser} className="text-white ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
