package com.coursework.pc_configurator.repository;

import com.coursework.pc_configurator.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Знайти всі замовлення конкретного користувача (для історії покупок)
    List<Order> findByUserEmail(String email);
}