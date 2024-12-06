import axios from "axios";
import { useEffect, useState } from "react";

export default function ShowLaptop(){
    const [laptop, setLaptop] = useState([{model: '', brand: ''}]);

    useEffect(() => {
        async function fetch(){
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/employee/${localStorage.getItem("id")}/laptops`);
            const data = res.data;
            
            setLaptop(res.data[0]);
            console.log(laptop);
        }

        fetch();
    }, [])

    return (
        <div className="p-4 flex flex-col text-2xl items-center mt-10 bg-gray-100 rounded-lg shadow-md w-3/4 mx-auto">
      <h2 className="text-3xl mb-4 font-semibold text-gray-800">Laptop Details</h2>
      <div className="mb-6 text-left w-full px-4">
        <div><strong>Brand:</strong> {laptop.brand}</div>
        <div><strong>Model:</strong> {laptop.model}</div>
        <div><strong>Serial Number:</strong> {laptop.serialNumber}</div>
        <div><strong>Status:</strong> {laptop.status}</div>
        <div><strong>Purchase Date:</strong> {new Date(laptop.purchaseDate).toLocaleDateString()}</div>


      </div>
    </div>
    )
}