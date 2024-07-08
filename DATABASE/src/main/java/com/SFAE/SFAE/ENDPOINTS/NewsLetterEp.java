package com.SFAE.SFAE.ENDPOINTS;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENUM.JobList;

@RequestMapping("/newsLetter")
public interface NewsLetterEp {

    @PostMapping("")
    ResponseEntity<?> safeEmailToNewsLetter(@RequestBody String emailCustomer);

    @PostMapping("/sendNews")
    ResponseEntity<?> sendEmailToCustomer(@RequestBody List<JobList> jobType);

    @PostMapping("/sendOwnNews")
    ResponseEntity<?> sendOwnEmailToCustomer(@RequestBody String titel, String text);

    @GetMapping("")
    ResponseEntity<?> getAllEmailsSend();
}