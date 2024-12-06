import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLaptops } from '../store/slices/adminSlice';
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import AddLaptopModal from '../components/AddModal';
import { fetchEmployees } from '../store/slices/employeeSlice';
import { DeleteIcon, LinkIcon } from '../icons';
import axios from 'axios';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { laptops, categorized, loading, error } = useSelector((state) => state.adminSlice);

  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    dispatch(fetchLaptops());
    dispatch(fetchEmployees())
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center h-screen mt-10 ">
      <div className="grid grid-cols-2 gap-4 w-3/4 mb-6">
        <Card title={"Total Laptops"} subtitle={laptops.length} onClick={() => navigate("/dashboard")} />
        <Card title={"Assigned Laptops"} subtitle={categorized.assigned.length} onClick={() => navigate("/assigned-laptops")}  />
        <Card title={"Available Laptops"} subtitle={categorized.available.length} onClick={() => navigate("/available-laptops")} />
        <Card title={"Laptops under maintenance"} subtitle={categorized.maintenance.length} onClick={() => navigate("/maintenance-laptops")} />
        <Card title={"View Laptop Reports"} subtitle={''} onClick={() => navigate("/report")} />
        <Card title={"View Laptop Requests"} subtitle={''} onClick={() => navigate("/request")} />
      </div>

      <div className='flex justify-end mb-2 w-3/4 '>
        <div>
            <Button text={"Add Laptop"} onClick={openModal} />
        </div>
      </div>

      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md mb-1/4">Laptop Details

        <h2 className="text-2xl font-semibold mb-4">All Laptops</h2>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border-b">Brand</th>
              <th className="p-2 border-b">Model</th>
              <th className="p-2 border-b">Serial Number</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Link</th>
              <th className="p-2 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {laptops.map((laptop) => (
              <tr key={laptop.id} className="hover:bg-gray-100">
                <td className="p-2 border-b">{laptop.brand}</td>
                <td className="p-2 border-b">{laptop.model}</td>
                <td className="p-2 border-b">{laptop.serialNumber}</td>
                <td className="p-2 border-b">{laptop.status}</td>
                <td className="p-2 border-b" onClick={() => navigate(`/laptop/${laptop.id}`)}><LinkIcon/></td>
                <td className="p-2 border-b" onClick={async() => {
                  const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/laptop/${laptop.id}`);
                  navigate('/dashboard')
                }}><DeleteIcon/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddLaptopModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
