package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.ENUM.StatusOrder;
import com.SFAE.SFAE.ENUM.Status;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Service.PasswordHasher;

/**
 * Implementation of WorkerInterface for managing Worker entities.
 * 
 * @author Levent
 */
@Component
public class WorkerImpl implements WorkerInterface {
  @Autowired
  private PasswordHasher encoder;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Autowired
  private DataFactoryImp dataFactory;

  /**
   * Counts the number of Workers in the database.
   * 
   * @return the count of Workers.
   */
  @Override
  public long countWorker() {
    List<Object> result = jdbcTemplate.query(

        "SELECT COUNT(ID) FROM CUSTOMER",

        (rs, rowNum) -> {
          long count = rs.getInt(1);
          return count;
        });
    if (result.isEmpty()) {
      return 0;
    } else {
      return result.size();
    }
  }

  /**
   * Retrieves all Workers from the database.
   * 
   * @return an Iterable collection of Worker entities.
   */
  @Override
  public Iterable<Worker> findAllWorker() {

    var result = jdbcTemplate.queryForStream(

        "SELECT * FROM Worker",

        (rs, rowNum) -> createWorker(rs))
        .filter(opt -> opt.isPresent())
        .map(opt -> opt.get())
        .collect(Collectors.toList());
    return result;
  }

  /**
   * Finds a Worker by their ID.
   * 
   * @param id the ID of the Worker.
   * @return a Worker object or null if not found.
   */
  @Override
  public Worker findWorkersbyID(long id) {
    if (id < 0) {
      throw new IllegalArgumentException("Id is <0");
    }

    List<Optional<Worker>> result = jdbcTemplate.query(

        "SELECT * FROM WORKER WHERE id = ?",
        ps -> {

          ps.setInt(1, (int) id);
        },

        (rs, rowNum) -> createWorker(rs));
    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;

  }

  /**
   * Finds a Worker by their name.
   * 
   * @param name the name of the Worker.
   * @return a Worker object or null if not found.
   */
  @Override
  public Worker findWorkerbyName(String name) {
    if (name == null) {
      throw new IllegalArgumentException("name is null");
    }
    List<Optional<Worker>> result = jdbcTemplate.query(
        "SELECT * FROM WORKER WHERE name = ?",
        ps -> {
          ps.setString(1, name);
        },
        (rs, rowNum) -> createWorker(rs));
    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;
  }

  /**
   * Deletes a Worker by their ID.
   * 
   * @param id the ID of the Worker to delete.
   * @return true if the Worker was deleted, false otherwise.
   */
  @Override
  public Boolean deleteWorkerById(long id) {
    if (id < 0) {
      throw new IllegalArgumentException("Wrong Id" + id);
    }
    try {
      int deleted = jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection
            .prepareStatement("DELETE FROM WORKER WHERE ID = ?;");
        ps.setLong(1, (Long) id);
        return ps;
      });
      if (deleted != 1) {
        return false;
      }
      return true;
    } catch (Error error) {
      throw new IllegalArgumentException("Conflict deleting Id" + id);
    }

  }

  /**
   * Updates a Worker's details in the database.
   * 
   * @param data the WorkerDTO containing updated Worker data.
   * @return the updated Worker object or null if the update fails.
   */
  @Override
  public Worker updateWorker(WorkerDTO data) {
    if (data == null) {
      throw new IllegalArgumentException("data is null" + data);
    }

    String password = encoder.hashPassword(data.getPassword());
    int rowsAffected = jdbcTemplate.update(
        "UPDATE worker SET name = ?, location = ?, password = ?, status = ?, status_order = ?, range = ?, job_type = ?, min_payment = ?, rating = ?, verification = ?, email = ? WHERE id = ?",
        ps -> {
          ps.setString(1, data.getName());
          ps.setString(2, data.getLocation());
          ps.setString(3, password);
          ps.setString(4, data.getStatus());
          ps.setString(5, data.getStatusOrder());
          ps.setDouble(6, data.getRange());
          ps.setString(7, data.getJobType());
          ps.setDouble(8, data.getMinPayment());
          ps.setDouble(9, data.getRating());
          ps.setBoolean(10, data.getVerification());
          ps.setString(11, data.getEmail());
          ps.setLong(12, data.getId());
        });

  
    if (rowsAffected > 0) {
     
      return new Worker(data.getName(), data.getLocation(), password, Status.valueOf(data.getStatus()),
          StatusOrder.valueOf(data.getStatusOrder()), data.getRange(), JobList.valueOf(data.getJobType()),
          data.getMinPayment(), data.getRating(), data.getVerification(), data.getEmail());
    } else {
      return null;
    }
  }

  /**
   * Creates a new Worker in the database.
   * 
   * @param rs the WorkerDTO containing the Worker data.
   * @return the newly created Worker object.
   */
  @Override
  public Worker createWorker(WorkerDTO rs) {
    if (rs.getName() == null || rs.getLocation() == null || rs.getPassword() == null ||
        rs.getJobType() == null || rs.getMinPayment() == null || rs.getEmail() == null) {
      throw new IllegalArgumentException("Some data are empty");
    }

    String name = rs.getName();
    String location = rs.getLocation();
    String password = encoder.hashPassword(rs.getPassword());
    String email = rs.getEmail();
    String status = "AVAILABLE";
    String statusOrder = "UNDEFINED";
    Double range = 0.0;
    String jobType = rs.getJobType();
    Double minPayment = rs.getMinPayment();
    Double rating = 0.0;
    Boolean verification = false;
    jdbcTemplate.update(connection -> {

      PreparedStatement ps = connection.prepareStatement(
          "INSERT INTO Worker (name, location, password, status, status_order, range, job_type, min_Payment, rating, verification, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

      ps.setString(1, name);
      ps.setString(2, location);
      ps.setString(3, password);
      ps.setString(4, status);
      ps.setString(5, statusOrder);
      ps.setDouble(6, range);
      ps.setString(7, jobType);
      ps.setDouble(8, minPayment);
      ps.setDouble(9, rating);
      ps.setBoolean(10, verification);
      ps.setString(11, email);

      return ps;
    });
    return new Worker(name, location, password, Status.valueOf(status), StatusOrder.valueOf(statusOrder), range,
        JobList.valueOf(jobType), minPayment, rating, verification, email);

  }

  /**
   * Finds a Worker by their email address.
   * 
   * @param email the email of the Worker.
   * @return a Worker object or null if not found.
   */
  @Override
  public Worker findWorkerbyEmail(String email) {
    if (email == null) {
      throw new IllegalArgumentException("Email is empty");
    }

    List<Optional<Worker>> result = jdbcTemplate.query(
        "SELECT * FROM WORKER WHERE email = ?",
        ps -> {
          ps.setString(1, email);
        },
        (rs, rowNum) -> createWorker(rs));

    if (!result.isEmpty() && result.get(0).isPresent()) {
      return result.get(0).get();
    }
    return null;
  }

  /**
   * Helper method to construct a Worker object from a ResultSet.
   * 
   * @param rs the ResultSet containing Worker data.
   * @return an Optional containing the Worker or empty if SQL exception occurs.
   */
  private Optional<Worker> createWorker(ResultSet rs) {
    try {
      Long id = rs.getLong("id");
      String name = rs.getString("name");
      String location = rs.getString("location");
      String password = rs.getString("password");
      String email = rs.getString("email");
      String status = rs.getString("status");
      String statusOrder = rs.getString("status_order");
      Double range = rs.getDouble("range");
      String jobType = rs.getString("job_type");
      Double minPayment = rs.getDouble("min_payment");
      Double rating = rs.getDouble("rating");
      Boolean verification = rs.getBoolean("verification");

      return dataFactory.createWorker(id, name, location, password, email, status, range, jobType, statusOrder,
          minPayment, rating, verification);

    } catch (SQLException e) {
    }

    return Optional.empty();
  }

   /**
   * Retrieves a Worker by their job type.
   * 
   * This method retrieves a Worker entity from the database based on their job type.
   * 
   * @param jobType The type of job of the Worker to find.
   * @return A Worker entity if found based on the provided job type, otherwise null.
   */
  @Override
  public Worker findWorkerByJob(String jobType) {
    List<Optional<Worker>> result = jdbcTemplate.query(
      "SELECT * FROM WORKER WHERE job_type = ?",
      ps -> {
        ps.setString(1, jobType);
      },
      (rs, rowNum) -> createWorker(rs));

  if (!result.isEmpty() && result.get(0).isPresent()) {
    return result.get(0).get();
  }
  return null;
}
}
