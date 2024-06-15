import React from 'react';
import { Analytics } from "@vercel/analytics/react"
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { firebaseSetup } from './firebase.js';
import AllRoutes from './routes.jsx';


//import header and footer
import Header from './components/multi-page/header.jsx';
import Footer from './components/multi-page/footer.jsx';

//firebase init
firebaseSetup();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <AllRoutes/>
      <Analytics/>
    </React.StrictMode>
  </BrowserRouter>
);