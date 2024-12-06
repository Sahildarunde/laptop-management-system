import InputField from "../components/InputField";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signin`, {
        email,
        password
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.employee.role);
        localStorage.setItem("id", res.data.employee.id);

        toast.success("Login successful!");

        if (res.data.employee.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate('/employee');
        }
      } else {
        console.error("Error: Incorrect credentials");
        toast.error("Incorrect credentials"); 
      }
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("Error during login. Please try again later."); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <Button
            text={loading ? "Loading..." : "Log In"} 
            onClick={handleSubmit}
            disabled={loading} 
          />
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/" className="text-indigo-600 hover:text-indigo-800">
            Log In
          </a>
        </p>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div>
  );
}
