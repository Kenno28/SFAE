
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarComponent.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { checkLoginStatus, deleteCookie } from '../backend/api';
import { useEffect, useState } from 'react';
import { LoginInfo } from './LoginManager';

export function NavbarComponent() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  if (loginInfo){
console.log (loginInfo)
  }
  async function doLogout() {
      await deleteCookie();
      window.location.href = "/";
  }
  
  async function fetchLoginStatus() {
      try {
          const loginStatus = await checkLoginStatus();
          console.log(loginStatus);
          if (loginStatus) {
              setLoginInfo(loginStatus);
          }
      } catch (e) {
          console.log(e);
      }
  }

  useEffect(() => {
      fetchLoginStatus();
  }, []);

  return (
      <>
          <nav className="page-background">
              <div className="navbar-left">
                  <img src="/Sfae_Logo.png" alt="Logo" className="navbar-logo"/>
              </div>
              <ul>
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}`}>Home</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/profile`}>Profil</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/uebersicht`}>Übersicht</a></li>
                  )}
                   {loginInfo && loginInfo.admin ==="ADMIN" && (
                      <li><a href={`/admin/${loginInfo.userId}/dienstleistungen`}>Admin</a></li>
                  )}
                  <li><a href="#" onClick={doLogout}>Logout</a></li>
              </ul>
          </nav>
      </>
  );
}


export default NavbarComponent;