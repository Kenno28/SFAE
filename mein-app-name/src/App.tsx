import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import { createMemoryHistory } from "history";
import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import { PageRegistration } from "./components/PageRegistration";
import { PageRegistrationWorker } from "./components/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/PageWorkerIndex";
import { PageIndexCustomer } from "./components/PageIndexCustomer";
import { PageOrderRequest } from "./components/PageOrderRequest";
import { PageOrderOverview } from "./components/PageOrderOverview";
import { PageOrderCompleted } from "./components/PageOrderCompleted";
import { PageOrderRating } from "./components/PageOrderRating";
import { PageWorkerOrderOverview } from "./components/PageWorkerOrderOverview";
import { PageCustomerFAQ } from "./components/PageCustomerFAQ";
import { PageWorkerFinances } from "./components/PageWorkerFinances";
import { PageWorkerProfile } from "./components/PageWorkerProfile";
import { PageWorkerPreferences } from "./components/PageWorkerPreferences";
import { PageWorkerFAQ } from "./components/PageWorkerFAQ";
import { PageWorkerOrders } from "./components/PageWorkerOrders";

const history = createMemoryHistory();

function App() {
  return (
    <>
      <Routes>
        {/* Gemeinsame Routen */}
        <Route path="/" element={<PageIndex />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/registration/customer" element={<PageRegistration />} />
        <Route path="/registration/worker" element={<PageRegistrationWorker />}/>

        {/* Customer */}
        <Route path="/customer/:customerId" element={<PageIndexCustomer />} />
        <Route path="/customer/:customerId/faq" element={<PageCustomerFAQ />} />
        <Route path="/customer/:customerId/orders/new"element={<PageOrderRequest />}/>
        <Route path="/customer/:customerId/orders/:order/overview"element={<PageOrderOverview />}/>
        <Route path="/customer/:customerId/orders/:order/completed"element={<PageOrderCompleted />}/>
        <Route path="/customer/:customerId/orders/:order/rating"element={<PageOrderRating />}/>

        {/* Worker */}
        <Route path="/worker/:workerId" element={<PageWorkerIndex />} />
        <Route path="/worker/:workerId/orders/overview"element={<PageWorkerOrderOverview />}/>
        <Route path="/worker/:workerId/finances"element={<PageWorkerFinances />}
        />
        <Route path="/worker/:workerId/profile"element={<PageWorkerProfile />}/>
        <Route path="/worker/:workerId/preferences"element={<PageWorkerPreferences />}/>
        <Route path="/worker/:workerId/faq" element={<PageWorkerFAQ />} />
        <Route path="/worker/:workerId/orders" element={<PageWorkerOrders />} />
      </Routes>
    </>
  );
}

export default App;
