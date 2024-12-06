import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenanceLaptops } from '../store/slices/adminSlice';
import Loader from '../components/Loader';

export default function MaintenanceLaptops() {
  const dispatch = useDispatch();
  
  const { maintenance, loading, error } = useSelector((state) => state.adminSlice.categorized);
  
  useEffect(() => {
    dispatch(fetchMaintenanceLaptops());
  }, [dispatch]);

  if (loading) {
    return <div><Loader /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 overflow-x-auto">
      <h1 className="md:text-3xl font-semibold text-center mb-6">Maintenance Laptops</h1>

      {maintenance.length === 0 ? (
        <p>No laptops in maintenance</p>
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
            {maintenance.map((laptop) => (
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
