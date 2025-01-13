import React, { useState } from "react";
import "./new.scss";
import Sidebar from "../../components/siderbar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getDatabase, ref, set, push } from "firebase/database";
import { getApps } from "firebase/app";

const New = () => {
  const [orderID, setOrderID] = useState("");
  const [orderName, setOrderName] = useState("");
  const [clientName, setClientName] = useState("");
  const [totalPhases, setTotalPhases] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    try {
      await set(ref(db, 'orders/' + orderID), {
        orderName,
        clientName,
        totalPhases,
        address,
        country
      });
      alert("Data Saved");
    } catch (error) {
      alert("Error: " + error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <h1>Order Form</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Order ID" value={orderID} onChange={(e) => setOrderID(e.target.value)} required />
          <input type="text" placeholder="Order Name" value={orderName} onChange={(e) => setOrderName(e.target.value)} required />
          <input type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          <input type="number" placeholder="Total Phases" value={totalPhases} onChange={(e) => setTotalPhases(e.target.value)} required />
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default New;
