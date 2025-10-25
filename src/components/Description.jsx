import { useState } from "react";

const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const MAX_LENGTH = 100;

  return (
    <div className="mt-3 text-sm text-gray-300">
      <p>
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
