import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeePortal from './pages/EmployeePortal';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import React from 'react';
import Navbar from './components/Navbar';
import AssignedLaptops from './pages/AssignedLaptops';
import AvailableLaptops from './pages/AvailableLaptops';
import MaintenanceLaptops from './pages/MaintenanceLaptops';
import LaptopPage from './pages/Laptop';
import ShowLaptop from './components/ShowLaptop';
import { ReportPage } from './pages/ReportPage';
import { RequestPage } from './pages/RequestPage';

function App() {
  return (
    <Router>  
      <div className='bg-slate-100'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeePortal />} />
          <Route path="/assigned-laptops" element={<AssignedLaptops />} />
          <Route path="/available-laptops" element={<AvailableLaptops />} />
          <Route path="/maintenance-laptops" element={<MaintenanceLaptops />} />
          <Route path="/laptop/:laptopId" element={<LaptopPage />} />
          <Route path="/laptop" element={<ShowLaptop />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/request" element={<RequestPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
