"use client"

import { useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";

export default function Home() {
  const [name, setName] = useState("");
  const [strength, setStrength] = useState(50);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendShock = async () => {
    if (!name || strength < 1 || strength > 100) return;
    setLoading(true);

    try {
      const response = await fetch("/api/zap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, strength }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");
        setStrength(50);
      } else {
        setError(true);
      }
    } catch (err) { // eslint-disable-line
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full text-center">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">Shock Alex</h1>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Shock Strength</label>
            <div className="relative mt-2">
              <input
                  type="range"
                  min={1}
                  max={100}
                  value={strength}
                  onChange={(e) => setStrength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold">
              {strength}
            </span>
            </div>
          </div>
          <button
              onClick={sendShock}
              disabled={loading}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Shocking..." : "Deliver Shock"}
          </button>
          {success && (
              <p className="text-green-500 mt-4">Zap successfully delivered to Alex!</p>
          )}
          {error && (
              <p className="text-red-500 mt-4">An error occurred. Please try again.</p>
          )}
        </div>
      </div>
  );
}
