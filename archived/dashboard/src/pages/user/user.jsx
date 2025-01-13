import React, { useState } from 'react';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, push } from "firebase/database";
import { useNavigate } from 'react-router-dom';

import './user.scss';

const User = () => {
  const [file, setFile] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const storage = getStorage();
    const storageRef = ref(storage, 'Uploaded Pictures/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle the upload task
      }, 
      (error) => {
        console.log(error);
        alert('Error uploading file');
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          const db = getDatabase();
          const newPictureRef = push(dbRef(db, 'Pictures Data')); // This will create a new unique id
          set(newPictureRef, {
            orderId,
            uploaderName,
            time: new Date().toISOString(),
            imageUrl: downloadURL,
            status: "Pending",
            modelResult: ""
          }).then(() => {
            alert('Data Saved');
            // Reset the state of each field
            setFile(null);
            setOrderId('');
            setUploaderName('');
          }).catch((error) => {
            console.log(error);
            alert('Error saving data');
          });
        });
      }
    );
  };

  return (
    <div className="user">
      <div className="userContainer">
        <div className="top">
          <h1>Add New Picture</h1>
          <button className="logout" onClick={() => navigate('/login')}>Logout</button>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>Order ID:</label>
                <input type="text" placeholder="Enter Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              </div>
              <div className="formInput">
                <label>Uploader Name:</label>
                <input type="text" placeholder="Enter Uploader Name" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} />
              </div>
              <button>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
