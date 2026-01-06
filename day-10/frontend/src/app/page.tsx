"use client";

import { useEffect, useState } from "react";

interface User {
  id?: number;
  name: string;
  type: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ name: "", type: "" });
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:4000/user";

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", type: "" });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950 dark:text-white">
      <main className="max-w-2xl mx-auto space-y-10">
        
        {/* Form Section */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 rounded border dark:bg-black dark:border-zinc-700"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="type"
              placeholder="type"
              className="p-2 rounded border dark:bg-black dark:border-zinc-700"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData,type: e.target.value })}
              required
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add User
            </button>
          </form>
        </section>

        {/* List Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">User List</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="grid gap-3">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-zinc-500">{user.type}</p>
                  </div>
                  <span className="text-zinc-400 text-xs">ID: {user.id}</span>
                </div>
              ))}
              {users.length === 0 && <p className="text-zinc-500 text-center">No users found.</p>}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
