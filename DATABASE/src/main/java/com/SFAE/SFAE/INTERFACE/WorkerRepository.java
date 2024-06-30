package com.SFAE.SFAE.INTERFACE;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.SFAE.SFAE.ENTITY.Worker;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, String> {
    @Query("SELECT w.id FROM Worker w ORDER BY CAST(SUBSTRING(w.id, 2) AS INTEGER)")
    List<String> findAllOrderedById();
}