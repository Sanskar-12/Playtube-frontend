import { useState } from "react";

const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const MAX_LENGTH = 100;

  return (
    <div
      className={`relative ${
        expanded ? "h-48" : "h-15"
      } overflow-y-auto px-1 py-1`}
    >
      <p
        className={`text-sm text-gray-300 whitespace-pre-line ${
          expanded ? "" : "line-clamp-1"
        }`}
      >
        {expanded || text?.length <= MAX_LENGTH
          ? text
          : text?.slice(0, MAX_LENGTH) + "..."}
      </p>

      {text?.length > MAX_LENGTH && (
        <button
          onClick={toggleExpanded}
          className="text-blue-400 mt-1 font-medium hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default Description;
