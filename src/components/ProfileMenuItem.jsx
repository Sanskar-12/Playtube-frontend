import React from "react";

const ProfileMenuItem = ({ onClick, icon, text }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 hover:bg-[#272727] text-left "
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default ProfileMenuItem;
