import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Blobs } from "../components/Blobs";

const VerificationPage: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { verifyEmail } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    if (value.length > 1) return;

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];

    pastedValue.split("").forEach((char, i) => {
      newCode[i] = char;
    });

    setCode(newCode);
    const nextFocusIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    setIsLoading(true);

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Blobs Background */}
      <div className="absolute inset-0 z-1">
        <Blobs />
      </div>

      {/* Verification Card */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-secondary to-primary text-transparent bg-clip-text">
              Verify Your Email
            </h2>
            <p className="text-center text-zinc-900 mb-6">
              Enter the 6-digit code sent to your email address. Check your spam
              folder if you can't find it.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-300 text-zinc-900 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || code.some((digit) => !digit)}
                className="w-full bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </motion.button>
            </form>

            <p className="text-center text-zinc-700 mt-4">
              Didn’t receive a code?{" "}
              <button
                onClick={() =>
                  navigate("/resend-verification", {
                    state: { fromVerify: true },
                  })
                }
                className="text-secondary hover:text-primary focus:outline-none disabled:opacity-50"
              ></button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
