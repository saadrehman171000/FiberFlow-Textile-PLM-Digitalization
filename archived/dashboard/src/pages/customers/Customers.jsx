import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../index';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/siderbar/Sidebar';
import "./customers.scss";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const customersRef = ref(getDatabase(app), 'Customers');
    onValue(customersRef, (snapshot) => {
      const customersData = snapshot.val();
      const customersList = Object.entries(customersData);
      setCustomers(customersList);
    });
  }, []);

  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Client Name</th>
              <th>Representative Name</th>
              <th>Location</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {customers.map(([id, customer], index) => (
              <tr key={index}>
                <td>{id}</td>
                <td>{customer.clientName}</td>
                <td>{customer.representativeName}</td>
                <td>{customer.Location}</td>
                {/* Render more customer data as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
