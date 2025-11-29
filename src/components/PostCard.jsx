import axios from "axios";
import { useState } from "react";
import { FaComment, FaHeart, FaTimes } from "react-icons/fa";
import { serverUrl } from "../App";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import ReplySection from "./ReplySection";

const PostCard = ({ post }) => {
  const { user } = useSelector((state) => state.user);

  const [liked, setLiked] = useState(
    post?.likes?.some((uid) => uid.toString() === user?._id?.toString()) ||
      false
  );
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);
  const [replyLoading, setReplyLoading] = useState(false);

  const handleToggleLike = async () => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/post/likes`,
        {
          postId: post?._id,
        },
        {
          withCredentials: true,
        }
      );

      setLiked(
        data?.post?.likes?.some(
          (uid) => uid.toString() === user?._id?.toString() || false
        )
      );
      setLikeCount(data?.post?.likes?.length);
    } catch (error) {
      console.log(error);
      toast.error("Error in liking the post");
    }
  };

  const handleComment = async () => {
    if (!newComment) return;
    setCommentLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/post/comment`,
        {
          postId: post?._id,
          message: newComment,
        },
        {
          withCredentials: true,
        }
      );

      setComments(data?.post?.comments);
      setNewComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplyToComment = async ({ commentId, replyText }) => {
    setReplyLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/post/reply`,
        {
          postId: post?._id,
          commentId: commentId,
          message: replyText,
        },
        {
          withCredentials: true,
        }
      );

      setComments(data?.post?.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="w-100 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-700 mb-[50px] relative">
      <p className="text-base text-gray-200">{post?.content}</p>
      {post?.image && (
        <img
          src={post?.image}
          alt="Image"
          className="w-80 h-80 object-cover rounded-xl mt-4 shadow-md"
        />
      )}
      <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
        <span className="italic text-gray-500">
          {new Date(post?.createdAt).toDateString()}
        </span>
        <div className="flex gap-6">
          <button
            onClick={() => handleToggleLike()}
            className={`flex items-center gap-2 cursor-pointer transition ${
              liked ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            <FaHeart /> {likeCount}
          </button>
          <button
            className="flex items-center gap-2 hover:text-orange-400 cursor-pointer transition"
            onClick={() => setShowComments(true)}
          >
            <FaComment />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[50%] overflow-y-auto space-y-2">
          <div className="flex items-center w-full justify-between py-[10px]">
            <h3 className="text-gray-300 font-semibold mb-2">Comments</h3>
            <button
              className="text-gray-400 hover:text-orange-500 transition"
              onClick={() => setShowComments(false)}
            >
              <FaTimes size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-3 items-center">
            <img
              src={user?.photoUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleComment}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-700"
            >
              {commentLoading ? <ClipLoader size={20} color="black" /> : "Post"}
            </button>
          </div>

          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div className="bg-gray-700 p-3 rounded-lg" key={comment?._id}>
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={comment?.author?.photoUrl}
                      alt="Photo"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-semibold text-gray-200">
                      {comment?.author?.userName}
                    </span>
                  </div>
                  <p className="text-gray-200 ml-8">{comment?.message}</p>
                  <div>
                    {comment?.replies?.map((reply) => (
                      <div
                        key={reply?._id}
                        className="p-2 bg-[#2a2a2a] rounded"
                      >
                        <div className="flex items-center justify-start gap-1">
                          <img
                            src={reply?.author?.photoUrl}
                            alt="avatar"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <h2 className="text-[13px]">
                            @{reply?.author?.userName?.toLowerCase()}
                          </h2>
                          <p className="px-[20px] py-[20px]">
                            {reply?.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ReplySection
                    loading={replyLoading}
                    comment={comment}
                    handleReply={handleReplyToComment}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No Comments Yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
