import Sidebar from "../../components/siderbar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import List from "../../components/table/Table";
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { app } from '../../index';
import { useParams } from 'react-router-dom';

import "./single.scss";
import PictureApproval from "../../components/pictureapproval/PictureApproval";

const Single = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const orderRef = ref(getDatabase(app), `orders/${orderId}`);
    onValue(orderRef, (snapshot) => {
        if (snapshot.exists()) {
            setOrder(snapshot.val());
        }
    });
}, [orderId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    const orderRef = ref(getDatabase(app), `orders/${orderId}`);
    set(orderRef, order);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
        <div className="left">
        <div className="editButton" onClick={editMode ? handleSave : handleEdit}>
          {editMode ? 'Save' : 'Edit'}
        </div>
        <h1 className="title">Information</h1>
        <div className="item">
          {/* ... rest of your component */}
          <div className="details">
            <h1 className="itemTitle">{orderId}</h1>
            <div className="detailItem">
              <span className="itemKey">Client Name:</span>
              {editMode ? (
                <input
                  type="text"
                  name="clientName"
                  value={order.clientName}
                  onChange={handleChange}
                />
              ) : (
                <span className="itemValue">{order.clientName}</span>
              )}
            </div>
            <div className="detailItem">
              <span className="itemKey">Total Phases:</span>
              {editMode ? (
                <input
                  type="number"
                  name="totalPhases"
                  value={order.totalPhases}
                  onChange={handleChange}
                />
              ) : (
                <span className="itemValue">{order.totalPhases}</span>
              )}
            </div>
            <div className="detailItem">
              <span className="itemKey">Current Phase:</span>
              {editMode ? (
                <input
                  type="number"
                  name="currentPhase"
                  value={order.currentPhase}
                  onChange={handleChange}
                />
              ) : (
                <span className="itemValue">{order.currentPhase}</span>
              )}
            </div>
            <div className="detailItem">
              <span className="itemKey">Address:</span>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={order.address}
                  onChange={handleChange}
                />
              ) : (
                <span className="itemValue">{order.address}</span>
              )}
            </div>
            <div className="detailItem">
              <span className="itemKey">Country:</span>
              {editMode ? (
                <input
                  type="text"
                  name="country"
                  value={order.country}
                  onChange={handleChange}
                />
              ) : (
                <span className="itemValue">{order.country}</span>
              )}
            </div>
          </div>
        </div>
      </div>
          <div className="right">
            <PictureApproval />
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">Recent Pictures Uploaded</h1>
          <List/>
        </div>
      </div>
    </div>
  );
};

export default Single;