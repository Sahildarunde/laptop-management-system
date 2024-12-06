import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLaptop, fetchLaptops } from '../store/slices/adminSlice';
import axios from 'axios';
import { fetchEmployees } from '../store/slices/employeeSlice';
import SearchNames from './Search';

const AddLaptopModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [error, setError] = useState(null);
  const {employees} = useSelector(state => state.employeeSlice)
  const [id, setId] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!brand || !model || !serialNumber || !purchaseDate) {
      setError('All fields are required.');
      return;
    }
  
    const newLaptop = {
      brand,
      model,
      serialNumber,
      status: "AVAILABLE",
      purchaseDate: new Date(purchaseDate).toISOString(),
      assignedEmployee: status === 'ASSIGNED' ? query : null,
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/laptop`, 
        newLaptop
      );
  
      const laptopId = response.data.laptop.id; 
      if (status === 'ASSIGNED' && query) {
        console.log(query)
        const response1 = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/assign`,
          {
            laptopId,        
            employeeId: id,
          }
        );
  
        if (response1.status === 200) {
          
          dispatch(addLaptop({ ...newLaptop, id: laptopId }));
          closeModal();
        } else {
          setError('Failed to assign the laptop to the employee.');
        }
      } else {
        
        dispatch(addLaptop({ ...newLaptop, id: laptopId }));
        closeModal();
      }
  
    } catch (err) {
      setError('Failed to add the laptop. Please try again later.');
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Add Laptop</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              id="model"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
              Serial Number
            </label>
            <input
              id="serialNumber"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="MAINTENANCE">Under Maintenance</option>
            </select>
          </div>

          {status === 'ASSIGNED' && (
            <SearchNames names={employees} query={query} setQuery={setQuery} id={id} setId={setId}/>
          )}

          <div className="mb-4">
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              id="purchaseDate"
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={fetchLaptops}
            >
              Add Laptop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLaptopModal;
