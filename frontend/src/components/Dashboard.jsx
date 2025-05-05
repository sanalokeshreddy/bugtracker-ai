// components/Dashboard.jsx
import React from "react";

function Dashboard({ bugs }) {
  const countBy = (key, value) =>
    bugs.filter((b) => b[key] === value).length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Bug Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800">
        <div className="bg-gray-50 p-3 rounded shadow">
          <p>Total Bugs</p>
          <strong className="text-xl">{bugs.length}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded shadow">
          <p>Open</p>
          <strong className="text-xl">{countBy("status", "OPEN")}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded shadow">
          <p>In Progress</p>
          <strong className="text-xl">{countBy("status", "IN_PROGRESS")}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded shadow">
          <p>Resolved</p>
          <strong className="text-xl">{countBy("status", "RESOLVED")}</strong>
        </div>
        <div className="bg-green-100 p-3 rounded shadow">
          <p>Low Severity</p>
          <strong>{countBy("severity", "LOW")}</strong>
        </div>
        <div className="bg-yellow-100 p-3 rounded shadow">
          <p>Medium</p>
          <strong>{countBy("severity", "MEDIUM")}</strong>
        </div>
        <div className="bg-red-200 p-3 rounded shadow">
          <p>High</p>
          <strong>{countBy("severity", "HIGH")}</strong>
        </div>
        <div className="bg-red-400 p-3 rounded shadow text-white">
          <p>Critical</p>
          <strong>{countBy("severity", "CRITICAL")}</strong>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
