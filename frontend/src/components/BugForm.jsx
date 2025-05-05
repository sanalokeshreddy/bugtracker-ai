import React, { useEffect, useState } from "react";
import axios from "../axios";

function BugForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [users, setUsers] = useState([]);
  const [useAI, setUseAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        title,
        description,
        assignedTo: assignedTo ? { id: parseInt(assignedTo) } : null,
        reportedBy: reportedBy ? { id: parseInt(reportedBy) } : null,
        severity: useAI ? null : "MEDIUM"
        // 🔥 DO NOT send aiReasoning manually — it’s handled by backend
      };

      await axios.post("/bugs", payload);

      setMessage("✅ Bug reported successfully!");
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setReportedBy("");
      setUseAI(true);
      window.dispatchEvent(new Event("bug-created"));
    } catch (err) {
      console.error("❌ Submission failed:", err);
      setMessage("❌ Failed to submit bug.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Report a Bug</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Bug Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Bug Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Reported By Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Reported By</label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            required
          >
            <option value="">Select Reporting User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned To Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Assigned To</label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Use AI Checkbox */}
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={useAI}
            onChange={() => setUseAI(!useAI)}
          />
          <span>Use AI to auto-predict severity</span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-sm px-4 py-2 rounded ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          {loading ? "Submitting..." : "Submit Bug"}
        </button>

        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}

export default BugForm;
