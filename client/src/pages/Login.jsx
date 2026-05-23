import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      alert("Login failed");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-xl w-[350px]"
      >

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700 text-white"
        >
          Login
        </button>

        <p className="text-gray-300 mt-4 text-center">
          No account?
          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}