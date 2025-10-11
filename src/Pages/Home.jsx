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
import { useState } from "react";
import SidebarItem from "../components/sidebarItem";
import { useNavigate } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import { categories } from "../utils";

const Home = () => {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
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
              <button className="bg-[#272727] px-4 rounded-r-full border border-gray-700">
                <FaSearch />
              </button>
            </div>
            <button className="bg-[#272727] p-3 rounded-full">
              <FaMicrophone />
            </button>
          </div>

          {/* right */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1 bg-[#272727] px-3 py-1 rounded-full">
              <span className="text-lg">+</span>
              <span>Create</span>
            </button>
            <FaUserCircle className="text-3xl hidden md:flex text-gray-400" />
            <FaSearch className="text-lg md:hidden flex" />
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
              // navigate("/");
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
              // navigate("/shorts");
            }}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              // navigate("/subscribepage");
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
              // navigate("/history");
            }}
          />
          <SidebarItem
            icon={<FaList />}
            text="Playlists"
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => {
              setSelectedItem("Playlists");
              // navigate("/saveplaylist");
            }}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Save videos"
            open={sidebarOpen}
            selected={selectedItem === "Save videos"}
            onClick={() => {
              setSelectedItem("Save videos");
              // navigate("/savevideos");
            }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked videos"}
            onClick={() => {
              setSelectedItem("Liked videos");
              // navigate("/likedvideos");
            }}
          />
        </nav>
        <hr className="border-gray-800 my-3" />

        {sidebarOpen && (
          <p className="text-sm text-gray-400 px-2">Subscriptions</p>
        )}

        {/* Subscriptions */}
      </aside>

      {/* Main area */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
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
      </main>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileNav
          active={active === "Home"}
          icon={<FaHome />}
          text={"Home"}
          onClick={() => {
            setActive("Home");
            // navigate("/");
          }}
        />
        <MobileNav
          icon={<SiYoutubeshorts />}
          active={active === "Shorts"}
          text="Shorts"
          onClick={() => {
            setActive("Shorts");
            // navigate("/shorts");
          }}
        />
        <MobileNav
          icon={<IoIosAddCircle />}
          active={active === "+"}
          onClick={() => {
            setActive("+");
            // navigate("/shorts");
          }}
        />
        <MobileNav
          icon={<MdOutlineSubscriptions />}
          active={active === "Subscriptions"}
          onClick={() => {
            setActive("Subscriptions");
            // navigate("/subscribepage");
          }}
          text="Subscriptions"
        />
        <MobileNav
          onClick={() => navigate("/mobileprofile")}
          icon={<FaUserCircle />}
          text="You"
        />
      </nav>
    </div>
  );
};

export default Home;
