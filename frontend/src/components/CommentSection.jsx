import React, { useEffect, useState, useCallback } from "react";
import axios from "../axios";

function CommentSection({ bugId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/bugs/${bugId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [bugId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      if (!text.trim()) return;
      await axios.post(`/bugs/${bugId}/comments`, {
        text,
        user: { id: 1 },
      });
      setText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment.");
    }
  };

  useEffect(() => {
    if (bugId) fetchComments();
  }, [bugId, fetchComments]);

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
      <h4 className="font-medium mb-2">Comments</h4>

      {loading ? (
        <p className="text-gray-400 text-sm italic">Loading comments...</p>
      ) : Array.isArray(comments) && comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-auto pr-1">
          {comments.map((c) => (
            <li key={c.id} className="text-sm text-gray-800 bg-white rounded p-2 shadow">
              {c.text}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded text-sm"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
