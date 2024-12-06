import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedLaptops } from '../store/slices/adminSlice';

export default function AssignedLaptops() {
  const dispatch = useDispatch();
  
  const { assigned, loading, error } = useSelector((state) => state.adminSlice.categorized);
  
  useEffect(() => {
    dispatch(fetchAssignedLaptops());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Assigned Laptops</h1>

      {assigned.length === 0 ? (
        <p>No assigned laptops available</p>
      ) : (
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border-b">Laptop Name</th>
              <th className="p-2 border-b">Assigned To</th>
              <th className="p-2 border-b">Assigned Date</th>
              <th className="p-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {assigned.map((laptop) => (
              <tr key={laptop.id} className="hover:bg-gray-100">
                <td className="p-2 border-b">
                {laptop.laptop ? `${laptop.laptop.brand} ${laptop.laptop.model}` : 'N/A'}
                </td>
                <td className="p-2 border-b">{laptop.employee ? laptop.employee.name : 'N/A'}</td>
                <td className="p-2 border-b">
                {laptop.assignedAt ? new Date(laptop.assignedAt).toISOString().split('T')[0] : 'N/A'}
                </td>
                <td className="p-2 border-b">{laptop.laptop ? laptop.laptop.status : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
