package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENDPOINTS.ContractEP;
import com.SFAE.SFAE.ENTITY.Contract;
import com.SFAE.SFAE.INTERFACE.ContractInterface;
import com.SFAE.SFAE.Service.MailService;

import org.slf4j.Logger;

@RestController
public class ContractController implements ContractEP {
  private Logger logger;

  @Autowired  
  private ContractInterface dao;

  @Autowired
  private MailService mail;

  @Override
  public ResponseEntity<?> createContract(@RequestBody ContractDTO contract) {
    if(contract==null){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    try{
      Contract created=dao.createContract(contract);
      if(created!=null){
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
      }
    }
    catch(Exception e){
     return  ResponseEntity.status((HttpStatus.INTERNAL_SERVER_ERROR)).build();
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
  }

  @Override
  public ResponseEntity<?> deleteContactById(long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteContactById'");
  }

  @Override
  public ResponseEntity<?> findCustomerById(long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'findCustomerById'");
  }

  @Override
  public ResponseEntity<?> updateContract(Contract contract) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateContract'");
  }
  
}
