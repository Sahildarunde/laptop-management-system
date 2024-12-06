import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RequestModal from "../components/RequestModal";
import ReportModal from "../components/ReportModal"; 

export default function EmployeePortal() {
  const [laptopAssigned, setLaptopAssigned] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [name, setName] = useState("");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openReportModal = () => setReportModalOpen(true); 
  const closeReportModal = () => setReportModalOpen(false); 

  useEffect(() => {
    async function fetchLaptopData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/employee/${localStorage.getItem("id")}/laptops`
        );
        setLaptopAssigned(res.data);
      } catch (error) {
        console.error("Error fetching laptop data:", error);
      }
    }

    async function fetchEmployeeData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/employee/${localStorage.getItem("id")}`
        );
        setName(res.data.name);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }

    fetchEmployeeData();
    fetchLaptopData();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen mt-10">
      <div className="flex w-3/4 text-3xl font-bold mb-4">
        Hi {name}, Welcome
      </div>
      <div className="grid grid-cols-2 gap-4 w-3/4 mb-6">
        <Card
          title={"View Assigned Laptop"}
          subtitle={
            laptopAssigned.length > 0
              ? `${laptopAssigned[0].brand} ${laptopAssigned[0].model}`
              : "No laptop assigned"
          }
          onClick={() => {
            if (laptopAssigned.length > 0) navigate("/laptop");
          }}
        />
        <Card
          title={"Request New Laptop"}
          subtitle={""}
          onClick={openModal}
        />
        <Card
          title={"Report an Issue"}
          subtitle={""}
          onClick={laptopAssigned.length > 0 ? openReportModal : undefined}
        />
        {isModalOpen && (
          <RequestModal
            employeeId={localStorage.getItem("id")}
            onClose={closeModal}
          />
        )}
        {isReportModalOpen && (
          <ReportModal
            employeeId={localStorage.getItem("id")}
            onClose={closeReportModal}
            laptopId={laptopAssigned[0]?.id || ""}
          />
        )}
      </div>
    </div>
  );
}
