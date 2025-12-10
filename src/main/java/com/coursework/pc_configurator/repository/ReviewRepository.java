package com.coursework.pc_configurator.repository;

import com.coursework.pc_configurator.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Для сторінки товару (тільки схвалені)
    List<Review> findByProductIdAndStatus(Long productId, String status);

    // Для адмінки (всі нові)
    List<Review> findByStatus(String status);
}