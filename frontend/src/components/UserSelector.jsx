import React, { useEffect, useState } from "react";
import axios from "../axios";

function UserSelector({ onSelect }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
        if (res.data.length > 0) {
          setSelected(res.data[0].id);
          onSelect(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <div className="mb-3">
      <label className="block mb-1 text-sm text-gray-700">Select User</label>
      <select
        value={selected}
        onChange={handleChange}
        className="p-2 border rounded w-full text-sm"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserSelector;
