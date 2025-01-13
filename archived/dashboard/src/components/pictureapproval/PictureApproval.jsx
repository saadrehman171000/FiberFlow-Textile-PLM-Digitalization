import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { app } from '../../index';
import { useParams } from 'react-router-dom';

import "./pictureapproval.scss";

const PictureApproval = () => {
  const { orderId } = useParams();
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const picturesRef = ref(getDatabase(app), 'Pictures Data');
    onValue(picturesRef, (snapshot) => {
        const picturesData = snapshot.val();
        if (picturesData) {
            const picturesForOrder = Object.entries(picturesData).filter(([key, picture]) => picture.orderId === orderId);
            setPictures(picturesForOrder);
        }
    });
}, [orderId]);

 console.log(pictures)
  const handleApprove = async (key) => {
    const db = getDatabase(app);
    const pictureRef = ref(db, `Pictures Data/${key}`);
    onValue(pictureRef, (snapshot) => {
      const picture = snapshot.val();
      set(pictureRef, {
        ...picture,
        status: 'Approved'
      });
    });
  };
  
  const handleDisapprove = async (key) => {
    const db = getDatabase(app);
    const pictureRef = ref(db, `Pictures Data/${key}`);
    onValue(pictureRef, (snapshot) => {
      const picture = snapshot.val();
      set(pictureRef, {
        ...picture,
        status: 'Disapproved'
      });
    });
  };
  
  return (
    <div className="picture-approval">
      <h1>Picture Approval for Order</h1>
      <table>
        <thead>
          <tr>
            <th>Picture ID</th>
            <th>Order ID</th>
            <th>Uploading Date</th>
            <th>Model Result</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pictures.map(([key, picture], index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>{picture.orderId}</td>
              <td>{picture.time}</td>
              <td>{picture.modelResult}</td>
              <td>{picture.status}</td>
              <td>
                {picture.status === 'Pending' && (
                  <>
                    <button onClick={() => handleApprove(key)}>Approve</button>
                    <button onClick={() => handleDisapprove(key)}>Disapprove</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PictureApproval;
