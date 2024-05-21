import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerResource } from '../../Resources';
import { deleteCustomer, getCustomerbyID, updateCustomer } from '../../backend/api';
import NavbarComponent from '../NavbarComponent';
import "./PageProfil.css";
import { MDBTypography } from 'mdb-react-ui-kit';
import { LinkContainer } from 'react-router-bootstrap';

export function PageProfil() {
    const params = useParams();
    const customerId = params.customerId!;
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<CustomerResource>();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState(password);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value == null){
            setPassword(password)
        } else{
             setPassword(event.target.value);
        }
    };


    async function handleUpdateCustomer(){
        const updateData:CustomerResource={
          name:name,
          password: password,
          email:email,
          role:"CUSTOMER",
          id:customerId
        }
        if(password.trim()!==""){
          updateData.password=password
        }
        try{
          await updateCustomer(updateData)
        }
        catch(error){
          console.log("Fehler:"+error)
        }
      }

    const handleDeleteCustomer = async () => {
        try {
            await deleteCustomer(customerId);
            console.log("Konto erfolgreich gelöscht.");
        } catch (error) {
            console.error('Fehler beim Löschen des Kontos:', error);
        }
    };



    useEffect(() => {
        async function getCustomer() {
            try {
                let customer = await getCustomerbyID(customerId);
                setName(customer.name);
                setPassword(customer.password);
                setEmail(customer.email);
                setCustomer(customer);
            } catch (error) {
                console.log('Fehler:' + error);
            }
        }
        getCustomer();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const updateData: CustomerResource = {
                name: name,
                email: email,
                role: 'CUSTOMER',
                password: password,
                id: customerId,
            };
            await updateCustomer(updateData);
            // Erfolgsmeldung anzeigen
            console.log("Profil erfolgreich aktualisiert!");
        } catch (error) {
            console.log("Fehler beim Aktualisieren des Profils:", error);
        }
    };

    return (
        <>
            <NavbarComponent />
            <div className="custom-container2">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-4 pb-5">
                        {/* Account Sidebar */}
                        <div className="author-card pb-3">
                            <div className="author-card-cover" style={{ backgroundImage: 'url(https://bootdey.com/img/Content/flores-amarillas-wallpaper.jpeg)' }}>
                            </div>
                            <div className="author-card-profile">
                                <div className="author-card-avatar">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Daniel Adams" />
                                </div>
                                <div className="author-card-details">
                                    <h5 className="author-card-name text-lg">{name}</h5>
                                    <span className="author-card-position">Joined February 06, 2017</span>
                                </div>
                            </div>
                        </div>
                        <div className="wizard">
                            <nav className="list-group list-group-flush">
                                <a className="list-group-item active" href="#">
                                    <i className="fe-icon-user text-muted"></i>Profile Settings
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Profile Settings */}
                    <div className="col-lg-8 pb-5">
                        <form className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="account-fn">First Name</label>
                                    <input className="form-control" type="text" id="account-fn" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="account-ln">Last Name</label>
                                    <input className="form-control" type="text" id="account-ln" value="Adams" required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="account-email">E-mail Address</label>
                                    <input className="form-control" type="email" id="account-email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                </div>
                            </div>


                            <div className="col-md-6">
                            </div>

                            <form onSubmit={handleUpdateCustomer} className='col-md-6'>
                                <div >
                                    <div className="form-group">
                                        <label htmlFor="account-pass">New Password</label>
                                        <input className="form-control"
                                            type="password"
                                            id="account-pass"
                                            onChange={handleNewPasswordChange} />
                                    </div>
                                </div>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="account-confirm-pass">Confirm Password</label>
                                        <input className="form-control"
                                            type="password"
                                            id="account-confirm-pass"
                                            value={confirmPassword}
                                            
                                        />
                                    </div>
                                    {!passwordsMatch && (
                                        <MDBTypography tag='p' className='text-danger'>
                                            Die Passwörter stimmen nicht überein. Bitte überprüfen Sie Ihre Eingabe.
                                        </MDBTypography>
                                    )}
                                </div>
                            </form>
                            <div className="col-12">
                                <hr className="mt-2 mb-3" />
                                <div className="ButtonsDiv">

                                    <LinkContainer to={`/customer/${customerId}`}>
                                    <Button className = "ButtonUpdate" onClick={handleUpdateCustomer}>
                                          Update Profile
                                        </Button>
                                    </LinkContainer>

                                    <Button type="button" className="btn btn-danger" onClick={handleShow}>
                                        Delete Your Account
                                    </Button>

                                    <Modal show={showModal} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Delete Account</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Are you sure you want to delete your account? This action cannot be undone.</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="danger" onClick={handleDeleteCustomer}>
                                                Delete Account
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}