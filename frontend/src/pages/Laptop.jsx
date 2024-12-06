import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SearchNames from '../components/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../store/slices/employeeSlice';

const LaptopPage = () => {
  const { laptopId } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [isAssigned, setIsAssigned] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const {employees} = useSelector(state => state.employeeSlice)
  const [id, setId] = useState('');
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLaptopDetails = async () => {
      try {
        // First API call
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laptop/${laptopId}`);
        const data = response.data;
  
        // Set laptop details and handle assigned status
        setLaptop(data.laptop);
        if (data.laptop.status === 'ASSIGNED' && data.employee) {
          setIsAssigned(true);
          setEmployeeId(data.employee.id);
          setEmployeeName(data.employee.name);
        } else {
          setIsAssigned(false);
          setEmployeeId('');
          setEmployeeName('');
        }
      } catch (err) {
        // Check for the specific error message
        if (err.response && err.response.data && err.response.data.error === "Laptop assignment not found") {
          try {
            // Second API call for available laptops
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laptop-find/${laptopId}`);
            const data = response.data;
  
            // Set laptop details for available laptops
            setLaptop(data.laptop);
            setIsAssigned(false);
            setEmployeeId('');
            setEmployeeName('');
          } catch (secondErr) {
            console.error('API Error (Second Fetch):', secondErr);
            setError('Failed to fetch laptop details. Please try again later.');
          }
        } 
      }
    };
  
    fetchLaptopDetails();
  }, [laptopId]);
  

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch ])

  const handleAssign = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/assign`, {
        laptopId: parseInt(laptopId),
        employeeId: id,
      });
      if (response.status === 200) {
        setIsAssigned(true);
        setEmployeeName(query);
        setEmployeeId(id);
        setError('');
      }
    } catch (err) {
      setError('Failed to assign the laptop.');
    }
  };

  const handleUnassign = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/unassign-laptop`, {
        laptopId,
        status: "AVAILABLE"
      });
      if (response.status === 200) {
        setIsAssigned(false);
        setEmployeeName('');
        setEmployeeId('');
        setError('');
      }
    } catch (err) {
      setError('Failed to unassign the laptop.');
    }
  };



  if (!laptop) {
    return <div>Loading laptop details...</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center mt-10 bg-gray-100 rounded-lg shadow-md w-3/4 mx-auto">
      <h2 className="text-3xl mb-4 font-semibold text-gray-800">Laptop Details</h2>
      <div className="mb-6 text-left w-full px-4">
        <div><strong>Brand:</strong> {laptop.brand}</div>
        <div><strong>Model:</strong> {laptop.model}</div>
        <div><strong>Serial Number:</strong> {laptop.serialNumber}</div>
        <div><strong>Status:</strong> {laptop.status}</div>
        <div><strong>Purchase Date:</strong> {new Date(laptop.purchaseDate).toLocaleDateString()}</div>
        {isAssigned && (
          <>
            <div><strong>Assigned to:</strong> {employeeName}</div>
            <div><strong>Employee ID:</strong> {employeeId}</div>
          </>
        )}
      </div>

      {!isAssigned ? (
        <div className="w-full px-4">
          <SearchNames names={employees} query={query} setQuery={setQuery} id={id} setId={setId}/>
      
          <button
            onClick={handleAssign}
            className="p-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Assign Laptop
          </button>
        </div>
      ) : (
        <div className="w-full px-4">
          <button
            onClick={handleUnassign}
            className="p-2 w-full bg-red-500 text-white rounded hover:bg-red-600 transition">
            Unassign Laptop
          </button>
        </div>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default LaptopPage;
