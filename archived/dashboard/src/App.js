import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import List from './pages/list/List';
import Single from './pages/single/Single';
import New from './pages/new/New';
import User from './pages/user/user';
import Customers from './pages/customers/Customers';
import Products from './pages/products/Products'; // Make sure to import your Products component
import Alerts from './pages/alerts/Alerts'; // Make sure to import your Alerts component

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="user" element={<User />}>
            <Route index element={<List />} />
            <Route path=":userId" element={<Single />} />
            <Route path="new" element={<New />} />
          </Route>
          <Route path="order">
            <Route index element={<List />} />
            <Route path=":orderId" element={<Single />} />
            <Route path="new" element={<New />} />
          </Route>
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} /> {/* New route for products */}
          <Route path="alerts" element={<Alerts />} /> {/* New route for alerts */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
