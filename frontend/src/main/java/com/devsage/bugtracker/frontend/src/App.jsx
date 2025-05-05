// App.jsx
import React, { useEffect, useState } from "react";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import Dashboard from "./components/Dashboard";
import axios from "./axios";

function App() {
  const [bugs, setBugs] = useState([]);

  const fetchBugs = async () => {
    try {
      const res = await axios.get("/bugs");
      setBugs(res.data);
    } catch (err) {
      console.error("Failed to fetch bugs", err);
    }
  };

  useEffect(() => {
    fetchBugs();
    window.addEventListener("bug-created", fetchBugs);
    return () => window.removeEventListener("bug-created", fetchBugs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Devsage AI Bug Tracker
      </h1>
      <Dashboard bugs={bugs} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BugForm />
        <BugList bugs={bugs} />
      </div>
    </div>
  );
}

export default App;
