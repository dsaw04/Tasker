import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Blobs } from "../components/Blobs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { login, loginAsGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setUsernameError(false);
    setPasswordError(false);

    let hasError = false;

    // Check for empty fields
    if (!username.trim()) {
      setUsernameError(true);
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else if (error instanceof Error) {
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
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

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
      <div className="absolute top-[10%] left-[2%] z-20">
        <h1 className="text-white font-extrabold text-[60px] font-lexend">
          Sort out your
        </h1>
      </div>
      <div className="absolute top-[20%] left-[2%] z-20">
        <h1 className="text-white font-extrabold text-[60px] font-lexend">
          life
        </h1>
      </div>

      {/* Right Side with Form */}
      <div className="absolute top-0 left-1/3 w-2/3 h-full bg-white rounded-l-[40px] z-20 flex justify-center">
        <div className="w-[85%] gap-2 flex flex-col mt-12">
          <h1 className="text-5xl font-lexend font-bold text-zinc-900 mb-3">
            Welcome back,
          </h1>
          <div className="mt-20">
            <form onSubmit={handleLogin}>
              <div className="space-y-8">
                {/* Username Field */}
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={usernameError}
                  helperText={usernameError ? "Username is required." : ""}
                />

                {/* Password Field */}
                <FormControl
                  sx={{ width: "100%" }}
                  variant="outlined"
                  error={passwordError}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {passwordError && (
                    <p className="text-red-600 text-sm mt-1">
                      Password is required.
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="mt-20">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white text-xl font-semibold rounded-xl hover:bg-forestGreen transition duration-200"
                >
                  Login
                  {
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="text-white ml-2"
                    />
                  }
                </button>
              </div>
            </form>
            <div className="justify-between flex mt-4 items-center">
              <p>
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-secondary hover:text-primary"
                >
                  {" "}
                  Register
                </a>
              </p>
              <a
                href="/forgot-password"
                className="text-secondary hover:text-primary"
              >
                {" "}
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center my-4 mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-zinc-900 font-medium">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Add Guest Login Button */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-3 bg-secondary text-white text-xl rounded-xl hover:bg-primary transition duration-200"
          >
            Continue as Guest
            {<FontAwesomeIcon icon={faUser} className="text-white ml-2" />}
          </button>
        </div>
      </div>

      <img
        src="/assets/tasker-duck.svg"
        alt="Tasker Duck"
        className="absolute top-[15.5%] left-[0%] z-20 w-[600px] h-auto drop-shadow-md"
      />
    </div>
  );
};

export default Login;
