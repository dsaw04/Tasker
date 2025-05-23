import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Blobs } from "../components/Blobs";
import { AuthContext } from "../context/AuthContext";

const ResendVerificationPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { resendVerificationEmail } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resendVerificationEmail(email);
      navigate("/verify", { state: { fromResend: true } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-gray-100">
      {/* Blobs Background */}
      <div className="hidden md:block absolute inset-0 z-1">
        <Blobs />
      </div>

      {/* Resend Verification Card */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 md:p-0 max-w-md w-full bg-gray-100 md:bg-opacity-50 md:backdrop-filter md:backdrop-blur-xl rounded-2xl md:shadow-xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 md:bg-opacity-50 md:backdrop-filter md:backdrop-blur-xl rounded-2xl md:shadow-2xl p-8 w-full max-w-md"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-secondary to-primary text-transparent bg-clip-text">
              Resend Verification Code
            </h2>
            <p className="text-center text-zinc-900 mb-6">
              Enter your registered email address, and we'll send you a new
              verification code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-gray-300 text-zinc-900 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
