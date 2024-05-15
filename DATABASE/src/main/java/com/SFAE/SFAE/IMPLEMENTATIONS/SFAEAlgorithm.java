package com.SFAE.SFAE.IMPLEMENTATIONS;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENTITY.Worker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * @author erayzor
 * @authoer levent
 */

@Component
public class SFAEAlgorithm {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public Map<Worker, Double> getBestWorkersforTheJob(ContractDTO contract) {
    String sql = "SELECT " +
    "name, email, latitude, longitude, min_payment, rating,  " +
    "(6371 * acos( " +
    "cos(radians(?)) * " +
    "cos(radians(latitude)) * " +
    "cos(radians(longitude) - radians(?)) + " +
    "sin(radians(?)) * " +
    "sin(radians(latitude)) " +
    ")) AS distance_km " +
    "FROM WORKER " +
    "WHERE (6371 * acos( " +
    "cos(radians(?)) * " +
    "cos(radians(latitude)) * " +
    "cos(radians(longitude) - radians(?)) + " +
    "sin(radians(?)) * " +
    "sin(radians(latitude)) " +
    ")) < ? " +
    "ORDER BY rating;";
        try {
          List<Worker> result = jdbcTemplate.query(
            sql,
            ps -> {
              ps.setDouble(1, contract.getLatitude());
              ps.setDouble(2, contract.getLongitude());
              ps.setDouble(3, contract.getLatitude());
              ps.setDouble(4, contract.getLatitude());
              ps.setDouble(5, contract.getLongitude());
              ps.setDouble(6, contract.getLatitude());
              ps.setDouble(7, contract.getRange());
            },
            (rs, rowNum) -> {
                Worker worker = new Worker();
            worker.setName(rs.getString("name"));
            worker.setEmail(rs.getString("email"));
            worker.setLatitude(rs.getDouble("latitude"));
            worker.setLongitude(rs.getDouble("longitude"));
            worker.setMinPayment(rs.getDouble("min_payment"));
            worker.setRating(rs.getDouble("rating"));
          return worker;
            });

        Map<Worker, Double> bestWorkers = new HashMap<>();
        double ratingMin = result.get(0).getRating();
        double ratingMax = result.get(result.size() - 1).getRating();
        double minPaymentMin = contract.getMaxPayment();
        double maxPayment = 0;
        

        for (Worker worker : result) {
            if(worker.getMinPayment() < minPaymentMin) {
                minPaymentMin = worker.getMinPayment();
            }

            if(worker.getMinPayment() > maxPayment) {
              maxPayment = worker.getMinPayment();
          }
        }
        
        //Rule of three Begin
        double percent = 100;

        double secondValue = contract.getMaxPayment()/minPaymentMin;  
        
        double secondPercent = percent/secondValue;

        double thirdValue = maxPayment/minPaymentMin;

        double thirdPercent = secondPercent * thirdValue;
        
        
        percent -= secondPercent;

        secondPercent -= secondPercent;

        thirdPercent -= secondPercent;

        double oneTenth = percent / 10.0;
        //Rule of three End
       

        for (Worker worker : result) {
            double p = 0;
            double b = 0;

            //Create Index for the Price Index
            Map<Double, Double> index = new HashMap<>();
            
            for (int i = 0; i <= 10; i++) {  
                double x = (10 - i) / 10.0;
                index.put(oneTenth * i, x);
            } 

            //Rate the price between 0.1 and 1
            Map<Double, Double> sortedMap = new TreeMap<>(index);
            
            for (double i = 10; i >= 0; i--) {
                double y = oneTenth * i;
                if((thirdPercent) > y){
                    p = sortedMap.get(y);
                    break;
                } 
            }

            //Rate Rating of worker
            b = (worker.getRating() - ratingMin) / (ratingMax - ratingMin);
           
           
              if(p == 0){
                p = 0.1;
              }

              if(b==0){
                b = 0.1;
              }

            //Price and rating are added together
            if (p != 0) {
                double p2 = p * 0.4;
                double b2 = b * 0.6;
                double score = (b2 + p2);
                bestWorkers.put(worker, score);
            } else {
                System.out.println("Score calculation skipped due to division by zero");
            }
        }

      List<Map.Entry<Worker, Double>> entries = new ArrayList<>(bestWorkers.entrySet());
      entries.sort(Map.Entry.comparingByValue());

      //Final result for the three best workers
      if(entries.size() > 3){
        Map<Worker, Double> optimalWorker = new HashMap<>();
        for (int i = entries.size() - 1; i >= entries.size() - 3; i--) {
            optimalWorker.put(entries.get(i).getKey(), entries.get(i).getValue());
      }
      return optimalWorker;
      }

      return bestWorkers;
    } catch (Exception e) {
      System.out.println(e);
    }
   

    return null;
  }
}
