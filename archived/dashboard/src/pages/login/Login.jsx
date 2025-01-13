import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './login.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get credentials from JSON file
    const res = await axios.get('/credentials.json');
    const credentials = res.data;

    // Check if credentials match
    if (username === credentials.admin.username && password === credentials.admin.password) {
      navigate('/');
    } else {
      const user = credentials.users.find(user => user.username === username && user.password === password);
      if (user) {
        navigate('/user'); // Navigate to '/order/new' for regular users
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <div className="login">
      <h1>Textile PLM Automation</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
