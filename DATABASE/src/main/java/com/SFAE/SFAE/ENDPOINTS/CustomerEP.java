package com.SFAE.SFAE.ENDPOINTS;


import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.DTO.LoginRequest;

/**
 * @author erayzor
 */

@RequestMapping("/customer")
public interface CustomerEP{

    @PostMapping("")
    ResponseEntity<?> createCustomer(@RequestBody CustomerDTO customerData, BindingResult bindingResult);

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteCustomerById(@PathVariable("id") long id);

    @GetMapping("")
    ResponseEntity<Iterable<?>> findAllCustomers();

    @GetMapping("/{id}")
    ResponseEntity<?> findCustomerById(@PathVariable("id") long id);

    @GetMapping("/usr/{name}")
    ResponseEntity<?> findCustomerByName(@PathVariable String name);

    @PutMapping("")
    ResponseEntity<?> updateCustomer(@RequestBody CustomerDTO jsonData, BindingResult bindingResult);

    @PostMapping("/login")
    ResponseEntity<?> LoginCustomer(@RequestBody LoginRequest loginRequest, BindingResult bindingResult);
}
