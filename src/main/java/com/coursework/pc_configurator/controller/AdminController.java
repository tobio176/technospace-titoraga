package com.coursework.pc_configurator.controller;

import com.coursework.pc_configurator.model.Order;
import com.coursework.pc_configurator.model.Review;
import com.coursework.pc_configurator.model.User;
import com.coursework.pc_configurator.repository.OrderRepository;
import com.coursework.pc_configurator.repository.ProductRepository;
import com.coursework.pc_configurator.repository.ReviewRepository;
import com.coursework.pc_configurator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // X
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        double totalRevenue = orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }

    // --- КОРИСТУВАЧІ ---
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> toggleBan(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setBanned(!user.isBanned());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}