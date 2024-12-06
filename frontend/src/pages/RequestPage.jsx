import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

export function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/laptop-requests`
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching laptop requests:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [reload]);

  const handleAction = async (requestId, action, employeeId) => {
    try {
      if (action === "approve") {
        const availableLaptopResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/laptops/available`
        );
        const availableLaptop = availableLaptopResponse.data;

        if (!availableLaptop) {
          alert("No available laptops to assign");
          return;
        }

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/assign-laptop/${employeeId}`,
          {
            laptopId: availableLaptop.id, 
          }
        );
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/laptop-requests/${requestId}`
        );
      } else if (action === "reject") {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/laptop-requests/${requestId}`
        );
      }

      setReload(!reload); 
    } catch (error) {
      console.error(`Error processing ${action} request:`, error);
      alert(`Failed to ${action} the request`);
    }
  };

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Laptop Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center text-gray-600">No laptop requests available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Requested At</th>
                <th className="border px-4 py-2">Employee ID</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="border px-4 py-2">{request.description}</td>
                  <td className="border px-4 py-2">
                    {new Date(request.requestedAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">{request.employeeId}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleAction(request.id, "approve", request.employeeId)}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request.id, "reject")}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
