import InputField from "../components/InputField";
import Button from "../components/Button";
import Select from "../components/Select";
import { departmentOptions, roleOptions } from "../utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        name,
        email,
        password,
        department: dept,
        role
      });
      
      if (res.status === 201) {  
        navigate("/signin");
      } else {
        console.error("Error: Incorrect credentials");
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Select
            label="Select Role"
            id="role"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Select
            label="Select Department"
            id="department"
            options={departmentOptions}
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          />

          <Button 
            text="Sign Up" 
            onClick={handleSubmit}
          />
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/signin" className="text-indigo-600 hover:text-indigo-800">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
