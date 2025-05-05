// App.js
import React from "react";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Devsage AI Bug Tracker
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BugForm />
        <BugList />
      </div>
    </div>
  );
}

export default App;
