import React from 'react';
import { Analytics } from "@vercel/analytics/react"
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { firebaseSetup } from './firebase.js';
import AllRoutes from './routes.jsx';
import { AuthContextProvider } from './context/authContext.jsx';
import { IsMobileContextProvider } from './context/isMobileContext.jsx';
import AuthListener from './components/multi-page/authListener.jsx';

import ScrollToTop from './components/multi-page/scrollToTop.jsx';
import Footer from './components/multi-page/footer.jsx';

export function today() {
  let date = new Date();

  //day
  let day = date.getDate();

  //month
  let allMonths = ['january', 'february','march', 'april','may', 'june', 'july', 'august','september', 'october', 'november', 'december'];
  let month = allMonths[date.getMonth()];

  return {
    day: day,
    month: month,
  };
};

//firebase init
firebaseSetup();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
        <ScrollToTop/>

        <AuthContextProvider>
          <IsMobileContextProvider>

            <AuthListener/>
            <AllRoutes/>
            <Footer/>

          </IsMobileContextProvider>
        </AuthContextProvider>

        <Analytics/>
    </React.StrictMode>
  </BrowserRouter>
);