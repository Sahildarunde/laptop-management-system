import { useState } from "react";
import axios from "axios";

export default function ReportModal({ employeeId, onClose, laptopId }) {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };



  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/${employeeId}/report`,
        { laptopId, description, priority }
      );

      console.log("Report submitted:", response.data);
      onClose();  
    } catch (error) {
      setError("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Submit an Issue Report</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="laptopId">
              Laptop ID
            </label>
            <input
              type="text"
              id="laptopId"
              value={laptopId}
              onChange={(e) => {}}
              placeholder="Enter Laptop ID"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="description">
              Report Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter your issue report description..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={handlePriorityChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
