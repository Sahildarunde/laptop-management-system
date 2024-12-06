import { useState } from "react";
import axios from "axios";

export default function RequestModal({ employeeId, onClose }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/${employeeId}/laptop-request`,
        { description }
      );

      console.log("Laptop request created:", response.data);
      onClose();  
    } catch (error) {
      setError("Failed to create laptop request. Please try again.");
      console.error("Error creating laptop request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Laptop Request</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="description">
              Request Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter your laptop request description..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
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
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
