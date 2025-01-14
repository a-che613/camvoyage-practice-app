"use client";

import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../../../utils/firebase";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validation logic
    try {
      if (!email || !password) {
        setError("Both fields are required.");
        return;
      }

      setError("");
      // console.log("Form submitted:", formData);

      const res = await signInWithEmailAndPassword(formData.email, formData.password);

      // console.log(res.user.uid);
      sessionStorage.setItem('user', JSON.stringify({
        uid: res.user.uid,
        email: formData.email,
        password: formData.password,
        username: formData.username == "" ? "Admin" : formData.username,
      }));
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error', error)
    }
    // Add your sign-in logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-[#333]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        {error && (
          <div className="text-red-600 bg-red-100 p-3 mb-4 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-6 mt-6 flex flex-col">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a username (optional)"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
