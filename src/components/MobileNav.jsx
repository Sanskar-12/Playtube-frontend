const MobileNav = ({ icon, text, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 ${
        active ? "text-white" : "text-gray-400"
      } hover:scale-105`}
    >
      <span className="text-xl sm:text-2xl">{icon}</span>
      {text && <span className="text-[10px] sm:text-xs">{text}</span>}
    </button>
  );
};

export default MobileNav;
