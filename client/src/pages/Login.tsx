import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TextField } from "@mui/material";
import { Img } from "react-image";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
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
    }
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Left Side */}
      <div className="w-[45%] flex items-center justify-center">
        <div className="w-[65%] gap-2 flex flex-col">
          <h1 className="text-4xl font-serif text-zinc-900 mb-4">
            Welcome back
          </h1>
          <p className="text-zinc-600 font-serif mb-6">
            Log in to access your tasks
          </p>
          <form onSubmit={handleLogin} className="">
            <div className="space-y-4">
              {/* Material UI Input for Username */}
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* Material UI Input for Password */}
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-16">
              <button
                type="submit"
                className="w-full py-2 bg-olive text-white rounded-lg hover:bg-forestGreen transition duration-200"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-[55%]">
        <Img
          src="assets/forest.webp"
          className="object-cover object-center w-full h-full"
          alt="forest"
        />
      </div>
    </div>
  );
};

export default Login;
