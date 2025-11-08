import { useState } from "react";
import { ClipLoader } from "react-spinners";

const ReplySection = ({ shortId, loading, comment, handleReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const replyHandler = () => {
    handleReply({
      shortId,
      commentId: comment._id,
      replyText,
    });
    setShowReplyInput(false);
    setReplyText("");
  };

  const showReplyInputHandler = () => {
    setShowReplyInput(!showReplyInput);
  };

  return (
    <div className="mt-3">
      {showReplyInput && (
        <div className="flex gap-2 mt-1 ml-4">
          <input
            type="text"
            placeholder="Add a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-red-600 text-sm"
          />

          <button
            onClick={replyHandler}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm"
          >
            Reply
          </button>
        </div>
      )}

      <button
        onClick={showReplyInputHandler}
        className="ml-4 text-xs text-gray-400 mt-1"
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color="black" /> : "Reply"}
      </button>
    </div>
  );
};

export default ReplySection;
