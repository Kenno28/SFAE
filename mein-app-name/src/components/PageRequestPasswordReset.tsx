import React, { useState } from 'react';
import './PagePasswordReset.css';
import { MDBBtn, MDBContainer, MDBInput, MDBRow, MDBCol, MDBTypography, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { getUserFromEmail, requestPassword } from '../backend/api';
import { ContractResource, ContractResourceforWorker, CustomerResource, Position, TokenRessource, WorkerResource } from "../Resources";
import LoadingIndicator from './LoadingIndicator';

export function PageRequestPasswordReset(){
    const [getEmail, setEmail] = useState('');

    const handleNewPasswordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    async function reqPaw(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();  
       await requestPassword(getEmail);

    }
    
    return (
        <>
        <div className="animated-background">
        <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ backgroundSize: 'cover', height: '100vh' }}>
        <MDBCard className='worker-registration-container m-5'>
                <MDBCardBody>
                <h2 className="text-uppercase text-center mb-5" style={{color:"white"}}>Passwort zurücksetzen</h2>
               
                    <form onSubmit={reqPaw}>
                        <MDBInput wrapperClass='mb-3 inputField' 
                        labelClass='text-white' 
                        label='Email' 
                        id='email' 
                        type='string'
                        required
                        onChange ={handleNewPasswordChange}
                        />
                        <MDBRow>
                            <MDBCol size="auto">
                                <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='sm'>
                                    <Link to="/login" className="link button-text-large" >Zurück zum Login</Link>
                                </MDBBtn>
                            </MDBCol>
                            <MDBCol>
                                <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='sm' type="submit">Passwort zurücksetzen</MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBCardBody>
                </MDBCard>
        </MDBContainer>
        </div>
        </>

    );
}