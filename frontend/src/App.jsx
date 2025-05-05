// App.jsx
import React, { useEffect, useState } from "react";
import axios from "../axios";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList"; // ✅ Replace inline bug list with component

function App() {
  const [bugs, setBugs] = useState([]);

  const fetchBugs = async () => {
    try {
      const response = await axios.get("/bugs");
      setBugs(response.data || []); // ✅ Handles null or undefined safely
    } catch (err) {
      alert("Failed to load bugs.");
    }
  };

  const handleEdit = (bug) => {
    const event = new CustomEvent("edit-bug", { detail: bug });
    window.dispatchEvent(event);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/bugs/${id}`);
      fetchBugs();
    } catch (err) {
      alert("Failed to delete bug.");
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <BugForm onBugCreated={fetchBugs} />
      <BugList bugs={bugs} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
