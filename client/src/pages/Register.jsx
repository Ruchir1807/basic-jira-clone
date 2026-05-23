import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");

    } catch (error) {

      alert("Registration failed");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleRegister}
        className="bg-slate-800 p-8 rounded-xl w-[350px]"
      >

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          onChange={(e) => setName(e.target.value)}
        />

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
          className="w-full bg-green-600 p-3 rounded hover:bg-green-700 text-white"
        >
          Register
        </button>

        <p className="text-gray-300 mt-4 text-center">
          Already have an account?
          <Link
            to="/"
            className="text-blue-400 ml-2"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}