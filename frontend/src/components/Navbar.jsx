import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");  
  };

  const isLoggedIn = !!localStorage.getItem("token");  

  return (
    <nav className="bg-[#011627] p-4">
      <div className="container mx-auto flex justify-between items-center ">
        <div className="text-white font-semibold text-xl">
          <Link to={isLoggedIn ? localStorage.getItem("role") === "ADMIN" ? '/dashboard' : '/employee' : '/signin'}>LMS</Link>
        </div>

        <div className="hidden md:flex space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/" className="text-white font-bold bg-indigo-500 p-2 px-4 rounded-lg shadow  hover:text-slate-200">SignUp</Link>
              <Link to="/signin" className="text-white font-bold bg-indigo-500 p-2 px-4 rounded-lg shadow  hover:text-slate-200">LogIn</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-white font-bold bg-red-500 p-2 px-4 rounded-lg shadow border border-red-600 hover:text-red-200">
              Logout
            </button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden  p-4 space-y-4 ">
          {!isLoggedIn ? (
            <>
              <Link to="/" className="text-white bg-inidgo-700 hover:text-indigo-200 mr-5">SignUp</Link>
              <Link to="/signin" className="text-white hover:text-indigo-200">LogIn</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-white font-bold bg-red-500 p-2 px-4 rounded-lg shadow border border-red-600 hover:text-red-200">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
