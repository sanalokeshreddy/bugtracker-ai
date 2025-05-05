import React, { useEffect, useState, useCallback } from "react";
import axios from "../axios";
import CommentSection from "./CommentSection";

function BugList({ onEdit, onDelete }) {
  const [bugs, setBugs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openCommentBugId, setOpenCommentBugId] = useState(null);
  const [openAIReasoningBugId, setOpenAIReasoningBugId] = useState(null);
  const [aiReasonings, setAiReasonings] = useState({});
  const [loadingReasoningId, setLoadingReasoningId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBugs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/bugs");
      setBugs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch bugs:", err);
      setBugs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBugs();
    const listener = () => fetchBugs();
    window.addEventListener("bug-created", listener);
    return () => window.removeEventListener("bug-created", listener);
  }, [fetchBugs]);

  useEffect(() => {
    if (!Array.isArray(bugs)) {
      setFiltered([]);
      return;
    }
    
    let filtered = [...bugs];
    if (severityFilter) {
      filtered = filtered.filter((b) => b.severity === severityFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    setFiltered(filtered);
  }, [bugs, severityFilter, statusFilter]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-700";
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-400";
      case "LOW":
        return "bg-green-400";
      default:
        return "bg-gray-300";
    }
  };

  // Fetch AI reasoning when user clicks the button
  const fetchAIReasoning = useCallback(async (bugId, description) => {
    if (aiReasonings[bugId] || !description) return; // Already fetched or no description
    
    setLoadingReasoningId(bugId);
    try {
      const response = await axios.post("/ai/predict-severity", {
        description: description
      });
      
      if (response.data && response.data.reasoning) {
        setAiReasonings(prev => ({
          ...prev,
          [bugId]: response.data.reasoning
        }));
      }
    } catch (error) {
      console.error("Failed to fetch AI reasoning:", error);
      // Set error message in reasonings
      setAiReasonings(prev => ({
        ...prev,
        [bugId]: "Failed to load AI reasoning. Please try again."
      }));
    } finally {
      setLoadingReasoningId(null);
    }
  }, [aiReasonings]);

  const handleShowAIReasoning = useCallback((bug) => {
    if (!bug || !bug.id) return;
    
    const newBugId = openAIReasoningBugId === bug.id ? null : bug.id;
    setOpenAIReasoningBugId(newBugId);
    
    if (newBugId !== null && !aiReasonings[bug.id]) {
      fetchAIReasoning(bug.id, bug.description);
    }
  }, [openAIReasoningBugId, aiReasonings, fetchAIReasoning]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Reported Bugs</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="p-2 border rounded text-sm"
          disabled={isLoading}
        >
          <option value="">All Severities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded text-sm"
          disabled={isLoading}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-6">
          <p className="text-gray-600">Loading bugs...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <p className="text-gray-600">No bugs match your filters.</p>
      )}

      {/* Bug List */}
      {!isLoading && filtered.length > 0 && (
        <ul className="space-y-6">
          {filtered.map((bug) => (
            <li key={bug.id} className="p-4 bg-gray-50 border rounded shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">{bug.title || "Untitled Bug"}</h3>
                <span
                  className={`text-white text-sm px-3 py-1 rounded ${getSeverityColor(
                    bug.severity
                  )}`}
                >
                  {bug.severity || "UNKNOWN"}
                </span>
              </div>

              <p className="text-gray-700 text-sm whitespace-pre-line">
                {bug.description || "No description provided"}
              </p>
              <p className="text-sm text-gray-500">Status: {bug.status || "UNKNOWN"}</p>
              <p className="text-sm text-gray-500">
                Reported by: <strong>{bug.reportedBy?.name || "Unknown"}</strong>
              </p>

              {/* AI Reasoning toggle */}
              <div className="mt-2">
                <button
                  className="text-sm text-indigo-600 hover:underline"
                  onClick={() => handleShowAIReasoning(bug)}
                  disabled={loadingReasoningId === bug.id}
                >
                  {openAIReasoningBugId === bug.id
                    ? "Hide AI Reasoning"
                    : "Show AI Reasoning"}
                </button>

                {openAIReasoningBugId === bug.id && (
                  <div className="text-xs text-gray-600 italic mt-1 bg-gray-100 p-2 rounded transition-all duration-300 ease-in-out">
                    💡 <strong>AI Reasoning:</strong>{" "}
                    {loadingReasoningId === bug.id 
                      ? "Loading AI analysis..." 
                      : aiReasonings[bug.id] || "No reasoning available."}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => onEdit?.(bug)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(bug.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    setOpenCommentBugId((prev) => (prev === bug.id ? null : bug.id))
                  }
                  className="text-sm text-gray-700 hover:text-black underline"
                >
                  {openCommentBugId === bug.id ? "Hide Comments" : "Show Comments"}
                </button>
              </div>

              {openCommentBugId === bug.id && <CommentSection bugId={bug.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(BugList);