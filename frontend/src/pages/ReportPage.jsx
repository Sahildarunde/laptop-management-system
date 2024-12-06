import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function ReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch reports from the backend API
        const reportsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reports`);
        setReports(reportsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleMaintenanceStatus = async (laptopId, description) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/maintenance`, {
        laptopId: laptopId,
        description:description,
        cost: 15.45,
        status: 'MAINTENANCE',
      });
      alert(`Laptop status set to MAINTENANCE for laptop ID: ${laptopId}`);
     
      fetchData();
    } catch (error) {
      console.error('Error updating laptop status:', error);
      alert('Failed to update laptop status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Priority</th>
              <th className="border px-4 py-2">Reported At</th>
              <th className="border px-4 py-2">Laptop ID</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="border px-4 py-2">{report.description}</td>
                  <td className="border px-4 py-2">{report.priority}</td>
                  <td className="border px-4 py-2">{new Date(report.reportedAt).toLocaleString()}</td>
                  <td className="border px-4 py-2">{report.laptopId}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleMaintenanceStatus(report.laptopId, report.description)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Set to Maintenance
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center">
                  No reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
