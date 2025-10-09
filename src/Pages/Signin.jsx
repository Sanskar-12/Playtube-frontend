import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../assets/playtube1.png";
import axios from "axios";
import { serverUrl } from "../App";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Signin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      if (!email) {
        toast.error("Fill all the fields");
        return;
      }
    }
    if (step === 2) {
      if (!password) {
        toast.error("Fill all the fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePreviousArrow = (step) => {
    if (step === 2) {
      setPassword("");
      setStep(step - 1);
    }
    if (step === 1) {
      setEmail("");
      navigate("/");
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/api/v1/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      navigate("/");

      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error in Signing In");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg">
        <div className="flex items-center mb-6">
          <button className="text-gray-300 mr-3 hover:text-white">
            <FaArrowLeft size={20} onClick={() => handlePreviousArrow(step)} />
          </button>
          <span className="text-white text-2xl font-medium">Playtube</span>
        </div>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Sign in
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              with your Account to continue to Playtube.
            </p>

            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <div className="flex justify-between items-center  mt-10">
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Welcome
            </h1>
            <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6">
              <FaUserCircle className="mr-2" size={20} />
              {email}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label
                htmlFor="showPass"
                className="text-gray-300 cursor-pointer"
              >
                Show Password
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="text-blue-400 text-sm hover:underline"
                onClick={() => navigate("/forgetpassword")}
              >
                Forgot password?
              </button>
              <button
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
                onClick={handleSignIn}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Login"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signin;
