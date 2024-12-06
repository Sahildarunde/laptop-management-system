import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableLaptops } from '../store/slices/adminSlice';

export default function AvailableLaptops() {
  const dispatch = useDispatch();
  
  const { available, loading, error } = useSelector((state) => state.adminSlice.categorized);
  
  useEffect(() => {
    dispatch(fetchAvailableLaptops());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Available Laptops</h1>

      {available.length === 0 ? (
        <p>No available laptops</p>
      ) : (
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border-b">Brand</th>
              <th className="p-2 border-b">Model</th>
              <th className="p-2 border-b">Serial Number</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {available.map((laptop) => (
              <tr key={laptop.id} className="hover:bg-gray-100">
                <td className="p-2 border-b">
                  {laptop.brand}
                </td>
                <td className="p-2 border-b">
                {laptop.model}
                </td>
                <td className="p-2 border-b">
                  {laptop.serialNumber}
                </td>
                <td className="p-2 border-b">{laptop.status}</td>
                <td className="p-2 border-b">
                {laptop.purchaseDate ? new Date(laptop.purchaseDate).toISOString().split('T')[0] : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
