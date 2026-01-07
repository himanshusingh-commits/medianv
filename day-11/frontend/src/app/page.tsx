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

  const API_URL = "http://localhost:4000/users";

  // FETCH USERS
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

  // ADD USER
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

  // DELETE USER
  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950 dark:text-white">
      <main className="max-w-2xl mx-auto space-y-10">

        {/* FORM SECTION */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 rounded border dark:bg-black dark:border-zinc-700"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Type"
              className="p-2 rounded border dark:bg-black dark:border-zinc-700"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
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

        {/* LIST SECTION */}
        <section>
          <h2 className="text-xl font-bold mb-4">User List</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="grid gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-zinc-500">{user.type}</p>
                    <p className="text-xs text-zinc-400">ID: {user.id}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-zinc-500 text-center">No users found.</p>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
