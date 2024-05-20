import React, { ReactNode, useEffect, useState } from "react";
import "./App.css";
import { Route, Router, Routes , useNavigate} from "react-router-dom";
import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import PageRegistration from './components/PageRegistration';
import  PageRegistrationWorker  from "./components/worker/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/worker/PageWorkerIndex";
import { PageWorkerOrderOverview } from "./components/worker/PageWorkerOrderOverview";
import { PageWorkerFinances } from "./components/worker/PageWorkerFinances";
import { PageWorkerProfile } from "./components/worker/PageWorkerProfile";
import { PageWorkerPreferences } from "./components/worker/PageWorkerPreferences";
import { PageWorkerOrders } from "./components/worker/PageWorkerOrders";
import { PagePasswordReset } from "./components/PagePasswordReset";
import { MainMenu } from "./components/MainMenu";
import { LoginContext, LoginInfo } from "./components/LoginManager";
import { checkLoginStatus, login } from "./backend/api";
import PageRegistrationAdmin from "./components/PageRegistrationAdmin";
import { PageIndexAdmin } from "./components/PageIndexAdmin";
import { PageAdminDienstleistungen } from "./components/PageAdminDienstleistungen";
import { PageWorkerFAQ } from "./components/worker/PageWorkerFAQ";
import PageOrderRating from "./components/Order/PageOrderRating";
import PageOrderRequest from "./components/Order/PageOrderRequest";
import { PageOrderCompleted } from "./components/Order/PageOrderCompleted";
import { PageCustomerFAQ } from "./components/customer/PageCustomerFAQ";
import { PageIndexCustomer } from "./components/customer/PageIndexCustomer";
import { PageProfil } from "./components/customer/PageProfil";
import { PageUebersicht } from "./components/customer/PageUebersicht";
import { PageOrderOverview } from "./components/Order/PageOrderOverview";
import PageError from "./components/Error";



function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  const [email, setEmail] = useState(""); // Fügen Sie Zustände für E-Mail und Passwort hinzu
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function fetchLoginStatus() {
    try{
      const loginStatus = await checkLoginStatus();

        if (loginStatus) {
          setLoginInfo(loginStatus);
        } 
    } catch (e){
      console.log(e)
    }  
  }

  async function checkAndRedirect() {
    try {
      const loginStatus = await checkLoginStatus();

      if (loginStatus) {
        
        if (loginStatus.userId) {
          if (loginStatus.userId.startsWith("C")) {
            navigate(`/customer/${loginStatus.userId}`);
          } else {
            navigate(`/worker/${loginStatus.userId}`);
          }}
      } else {
      }
    } catch (error) {
      console.error("Error fetching login status:", error);
    }
  }



  useEffect(() => {
    fetchLoginStatus();
  }, []); 




  return (

    <><LoginContext.Provider value={{ loginInfo, setLoginInfo }}>

      <Routes>
        {/* Gemeinsame Routen */}
        {!loginInfo && <>
              <Route path="/" element={<PageIndex />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/registration/customer" element={<PageRegistration />} />
        <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
        <Route path="/passwordreset" element={<PagePasswordReset/>}/>
        <Route path="/mainmenu" element={<MainMenu/>}/> 
        </>
          }

        {loginInfo ? (
              <>
              <Route path="/registration/admin" element={<PageRegistrationAdmin />} />

              {loginInfo.userId.startsWith("C") &&
                <> 
                {/* Customer */}
                <Route path="/customer/:customerId" element={<PageIndexCustomer />} />
                <Route path="/customer/:customerId/faq" element={<PageCustomerFAQ />} />
                <Route path="/customer/:customerId/uebersicht" element={<PageUebersicht />} />
                <Route path="/customer/:customerId/profil" element={<PageProfil />} />
                {/* Order */}
                <Route path="/customer/:customerId/order/new"element={<PageOrderRequest/>}/>
                <Route path="/customer/:customerId/order/:orderId" element={<PageOrderOverview />} />
                <Route path="/customer/:customerId/orders/:order/completed"element={<PageOrderCompleted />}/>
                <Route path="/customer/:customerId/orders/:order/rating"element={<PageOrderRating />}/>
                </>
              }
             
              {loginInfo.userId.startsWith("W") && <> 
                {/* Worker */}
                <Route path="/worker/:workerId" element={<PageWorkerIndex/>} />
                <Route path="/worker/:workerId/orders/overview"element={<PageWorkerOrderOverview />}/>
                <Route path="/worker/:workerId/finances"element={<PageWorkerFinances />}/>
                <Route path="/worker/:workerId/profile"element={<PageWorkerProfile />}/>
                <Route path="/worker/:workerId/preferences"element={<PageWorkerPreferences />}/>
                <Route path="/worker/:workerId/faq" element={<PageWorkerFAQ />} />
                <Route path="/worker/:workerId/orders" element={<PageWorkerOrders />} />
              </>}
          
              {/* Admin */}
              <Route path="/admin/:adminId" element={<PageIndexAdmin />} />
              <Route path="/admin/:adminId/dienstleistungen" element={<PageAdminDienstleistungen />} />
             </>
              ): (
                <Route path="*" element={<PageError error={401} />} /> // Ändern
              ) 
        }
           
      </Routes>
      </LoginContext.Provider>
    </>
  );
}

export default App;
