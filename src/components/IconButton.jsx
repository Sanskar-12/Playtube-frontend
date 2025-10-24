/* eslint-disable no-unused-vars */
const IconButton = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div
        className={`${
          active ? "bg-white" : "bg-[#00000065] border border-gray-700"
        } p-3 rounded-full hover:bg-gray-700 transition`}
      >
        <Icon size={20} className={`${active ? "text-black" : "text-white"}`} />
      </div>
      <span>
        {label} {count !== undefined && `(${count})`}
      </span>
    </button>
  );
};

export default IconButton;
