import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../index';

import "./products.scss";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/siderbar/Sidebar";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(getDatabase(app), 'Products');
    onValue(productsRef, (snapshot) => {
      const productsData = snapshot.val();
      const productsArray = Object.values(productsData);
      setProducts(productsArray);
    });
  }, []);

  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <div className="productGrid">
          {products.map((product, index) => (
            <div key={index} className="productTile">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              {/* Render other product data here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
