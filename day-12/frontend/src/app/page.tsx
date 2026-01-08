"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, User, Mail } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<{ Name: string; email: string } | null>(null);
  

  const [formData, setFormData] = useState({  email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);
console.log("bhcdhscb")
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    if (isLogin) {
      const { email, password } = formData;
      console.log(' formData: ',  formData);
      
      // 2. Send only those two fields
      const response = await axios.post("http://localhost:3001/auth/login", { 
        email, 
        password 
      });

      const { access_token, user: userData } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

    } else {
      // For Signup, we send the whole thing (Name, Email, Password)
      await axios.post("http://localhost:3001/users", formData);
      alert("Signup successful!");
      setIsLogin(true);
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  }
};
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-xl rounded-2xl w-96 text-center border-t-4 border-blue-600">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-600 w-10 h-10" />
          </div>
          {/* Using user.Name exactly as returned from Backend */}
          <p className="text-gray-500 mb-6 flex items-center justify-center gap-2">
            <Mail size={16}/> {user.email}
          </p>
          <button
            onClick={() => { localStorage.clear(); setUser(null); }}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-2xl rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-black mb-6 text-center text-slate-800">
          {isLogin ? "Welcome" : "Join Us"}
  
        </h2>

        {error && <p className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</p>}

        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
              <input
                type="text"
                required
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John Doe"
                onChange={(e) => setFormData({ ...formData })}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Email </label>
            <input
              type="email"
              required
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="user@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 font-bold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </form>
    </div>
  );
}
