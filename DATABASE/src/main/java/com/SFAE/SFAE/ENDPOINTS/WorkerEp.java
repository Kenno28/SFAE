package com.SFAE.SFAE.ENDPOINTS;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;

/**
 * @author Levent
 */

public interface WorkerEp extends WorkerEPDoc{
  
    @PostMapping("")
    @Override
    ResponseEntity<Worker> createWorker(Map<String, Object> jsonData);

    @DeleteMapping("/{id}")
    @Override
    ResponseEntity<?> deleteWorkerById(long id);

    @GetMapping("")
    @Override
    Iterable<Worker> findAllWorker();

    @GetMapping("/{id}")
    @Override
    Optional<Worker> findWorkersbyID(long id);

    @GetMapping("/{name}")
    @Override
    Worker findWorkerByName(String Name);

    @PutMapping("")
    @Override
    ResponseEntity<?> updateWorker(Map<String, Object> jsonData);
    
}

