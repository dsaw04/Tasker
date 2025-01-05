import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TextField } from "@mui/material";
import { Img } from "react-image";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
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

  return (
    <div className="flex w-screen h-screen">
      {/* Left Side */}
      <div className="w-[45%] flex items-center justify-center">
        <div className="w-[65%] gap-2 flex flex-col">
          <h1 className="text-4xl font-serif text-zinc-900 mb-4">
            Create your account
          </h1>
          <p className="text-zinc-600 font-serif mb-6">
            Register to start managing your tasks
          </p>
          <form onSubmit={handleRegister} className="">
            <div className="space-y-4">
              {/* Material UI Input for Username */}
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* Material UI Input for Email */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className={`w-full py-2 text-white rounded-lg transition duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-olive hover:bg-forestGreen"
                }`}
                disabled={loading} // Disable button when loading
              >
                {loading ? "Registering..." : "Register"}
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

export default Register;
