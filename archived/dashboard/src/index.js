import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "plm-db-d53cc",  // Add the projectId here
  databaseURL: "https://plm-db-d53cc-default-rtdb.firebaseio.com/",
  storageBucket: "gs://plm-db-d53cc.appspot.com"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
