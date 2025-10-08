import { useState } from "react";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/playtube1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      if (!userName || !email) {
        alert("Fill all the fields");
        return;
      }
    }
    if (step === 2) {
      if (!password || !confirmPassword) {
        alert("Fill all the fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Password and ConfirmPassword don't match");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePreviousArrow = (step) => {
    if (step === 3) {
      setBackendImage(null);
      setFrontendImage(null);
      setStep(step - 1);
    }
    if (step === 2) {
      setPassword("");
      setConfirmPassword("");
      setStep(step - 1);
    }
    if (step === 1) {
      setEmail("");
      setUserName("");
      navigate("/");
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  console.log(`${serverUrl}/api/v1/signup`);

  const handleSignUp = async () => {
    if (!backendImage) {
      alert("Please choose profile image");
      return;
    }

    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendImage);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/api/v1/signup`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(data);
    } catch (error) {
      console.log(error);
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
          <span className="text-white text-2xl font-medium">
            Create Account
          </span>
        </div>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Basic Info
            </h1>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <div className="flex justify-end mt-10">
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
              Security
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
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
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
            <div className="flex justify-end mt-10">
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Choose Avatar
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-gray-500 overflow-hidden shadow-lg">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-500 w-full h-full p-2" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-gray-300 font-medium">
                  Choose Profile Picture
                </label>
                <input
                  type="file"
                  // ref={avatarRef}
                  onChange={handleAvatar}
                  accept="image/*"
                  className="block w-full text-sm text-gray-400 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
                onClick={handleSignUp}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
