package com.coursework.pc_configurator.repository;

import com.coursework.pc_configurator.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Метод для пошуку товарів певної категорії
    List<Product> findByCategoryName(String categoryName);
}