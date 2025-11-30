import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import logo from "../assets/playtube1.png";
import { useRef, useState } from "react";
import SidebarItem from "../components/sidebarItem";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import { categories } from "../utils";
import { useSelector } from "react-redux";
import Profile from "../components/Profile";
import AllVideosPage from "../components/AllVideosPage";
import AllShortsPage from "../components/AllShortsPage";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState(false);
  const [searchPopup, setSearchPopup] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [searchData, setSearchData] = useState({});
  const recognitionRef = useRef(null);

  const { user, subscribedChannels } = useSelector((state) => state.user);

  const speak = (message) => {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (e) => {
        let transcript = "";
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setText(transcript);
      };
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      await handleSearchData(text);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSearchData = async (text) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/search`,
        { input: text },
        {
          withCredentials: true,
        }
      );

      setText("");
      setInput("");
      setSearchPopup(false);
      setSearchData(data);

      const { videos = [], shorts = [], playlists = [], channels = [] } = data;

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are the top search results I found for you");
      } else {
        speak("No results found");
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {searchPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setSearchPopup(!searchPopup)}
            >
              <FaTimes size={22} />
            </button>

            <div className="flex flex-col items-center gap-3">
              {listening ? (
                <h1 className="text-xl sm:text-2xl font-semibold text-orange-400 animate-pulse">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg sm:text-xl font-medium text-gray-300">
                  Speak or type your query
                </h1>
              )}
              <div className="flex w-full gap-2 md:hidden mt-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="bg-red-500 hover:bg-orange-600 px-4 py-2 rounded-full text-white font-semibold shadow-md transition disabled:opacity-50"
                  onClick={() => handleSearchData(input)}
                >
                  {loading ? (
                    <ClipLoader size={24} color="white" />
                  ) : (
                    <FaSearch />
                  )}
                </button>
              </div>
            </div>

            {text && (
              <span className="text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60">
                {text}
              </span>
            )}

            <button
              className={`p-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
                listening
                  ? "bg-red-500 animate-pulse shadow-red-500/40"
                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/40"
              }`}
              onClick={toggleListening}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={24} color="white" />
              ) : (
                <FaMicrophone className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* header */}
      <header
        className="bg-[#0f0f0f] h-15 p-3 border-b
    border-gray-800 fixed top-0 left-0 right-0 z-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="text-xl bg-[#272727] p-2 rounded-full md:inline hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>
            <div className="flex items-center gap-[5px]">
              <img src={logo} alt="Logo" className=" w-[30px]" />
              <span className="text-white font-bold text-xl tracking-tight font-roboto">
                PlayTube
              </span>
            </div>
          </div>

          {/* search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="bg-[#272727] px-4 rounded-r-full border border-gray-700"
                onClick={() => handleSearchData(input)}
              >
                {loading ? (
                  <ClipLoader size={24} color="white" />
                ) : (
                  <FaSearch />
                )}
              </button>
            </div>
            <button
              className="bg-[#272727] p-3 rounded-full"
              onClick={() => setSearchPopup(!searchPopup)}
            >
              <FaMicrophone />
            </button>
          </div>

          {/* right */}
          <div className="flex items-center gap-3">
            {user?.channel && (
              <button
                className="hidden md:flex items-center gap-1 bg-[#272727] px-3 py-1 rounded-full"
                onClick={() => navigate("/create")}
              >
                <span className="text-lg">+</span>
                <span>Create</span>
              </button>
            )}
            {user && user?.photoUrl ? (
              <img
                src={user?.photoUrl}
                alt="img"
                className="w-9 h-9 rounded-full object-cover border-1 border-gray-700 hidden md:flex"
                onClick={() => setPopup((prev) => !prev)}
              />
            ) : (
              <FaUserCircle
                className="text-3xl hidden md:flex text-gray-400"
                onClick={() => setPopup((prev) => !prev)}
              />
            )}
            <FaSearch
              className="text-lg md:hidden flex"
              onClick={() => setSearchPopup(!searchPopup)}
            />
          </div>
        </div>
      </header>

      {/* sidebar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40
          ${
            sidebarOpen ? "w-60" : "w-20"
          } hidden md:flex flex-col overflow-y-auto`}
      >
        {/* general */}
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHome />}
            text={"Home"}
            open={sidebarOpen}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
            selected={selectedItem === "Home"}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscribedcontent");
            }}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && <p className="text-sm text-gray-400 px-2">You</p>}

        {/* You */}
        <nav className="space-y-1 mt-1">
          <SidebarItem
            icon={<FaHistory />}
            text="History"
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />
          <SidebarItem
            icon={<FaList />}
            text="Playlists"
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => {
              setSelectedItem("Playlists");
              navigate("/savedplaylist");
            }}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Saved videos"
            open={sidebarOpen}
            selected={selectedItem === "Saved videos"}
            onClick={() => {
              setSelectedItem("Saved videos");
              navigate("/savedcontent");
            }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked videos"}
            onClick={() => {
              setSelectedItem("Liked videos");
              navigate("/likedcontent");
            }}
          />
        </nav>
        <hr className="border-gray-800 my-3" />

        {sidebarOpen && (
          <p className="text-sm text-gray-400 px-2">Subscriptions</p>
        )}

        {/* Subscriptions */}

        <div className="space-y-1 mt-1">
          {subscribedChannels?.map((ch) => (
            <button
              key={ch?._id}
              onClick={() => {
                setSelectedItem(ch?._id);
                navigate(`/channel/${ch?._id}`);
              }}
              className={`flex items-center ${
                sidebarOpen ? "gap-3 justify-start" : "justify-center"
              } w-full text-left cursor-pointer p-2 rounded-lg transition ${
                selectedItem === ch._id ? "bg-[#272727]" : "hover:bg-gray-800"
              }`}
            >
              <img
                src={ch?.avatar}
                alt="Avatar"
                className="w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200"
              />
              {sidebarOpen && (
                <span className="text-sm text-white truncate">{ch?.name}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
        {location.pathname === "/" && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto hover:scrollbar-auto scrollbar-none pt-2 mt-[60px]">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700"
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <AllVideosPage />
              <AllShortsPage />
            </div>
          </>
        )}
        {popup && <Profile />}

        <div className="mt-2">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileNav
          active={active === "Home"}
          icon={<FaHome />}
          text={"Home"}
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />
        <MobileNav
          icon={<SiYoutubeshorts />}
          active={active === "Shorts"}
          text="Shorts"
          onClick={() => {
            setActive("Shorts");
            navigate("/shorts");
          }}
        />
        <MobileNav
          icon={<IoIosAddCircle />}
          active={active === "+"}
          onClick={() => {
            setActive("+");
            navigate("/create");
          }}
        />
        <MobileNav
          icon={<MdOutlineSubscriptions />}
          active={active === "Subscriptions"}
          onClick={() => {
            setActive("Subscriptions");
            navigate("/subscribedcontent");
          }}
          text="Subscriptions"
        />
        <MobileNav
          onClick={() => navigate("/mobileprofile")}
          icon={
            user && user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="img"
                className="w-9 h-9 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <FaUserCircle />
            )
          }
          text="You"
        />
      </nav>
    </div>
  );
};

export default Home;
