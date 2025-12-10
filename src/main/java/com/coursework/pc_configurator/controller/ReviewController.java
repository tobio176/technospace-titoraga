package com.coursework.pc_configurator.controller;

import com.coursework.pc_configurator.model.Product;
import com.coursework.pc_configurator.model.Review;
import com.coursework.pc_configurator.model.User;
import com.coursework.pc_configurator.repository.ProductRepository;
import com.coursework.pc_configurator.repository.ReviewRepository;
import com.coursework.pc_configurator.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // Отримати відгуки товару (ТІЛЬКИ СХВАЛЕНІ)
    @GetMapping("/reviews/product/{productId}")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return reviewRepository.findByProductIdAndStatus(productId, "APPROVED");
    }

    // Надіслати відгук
    @PostMapping("/reviews")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        if (user.isBanned()) {
            return ResponseEntity.status(403).body("Ваш акаунт заблоковано.");
        }

        Product product = productRepository.findById(request.getProductId()).orElseThrow();

        Review review = Review.builder()
                .text(request.getText())
                .rating(request.getRating())
                .type(request.getType())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .user(user)
                .product(product)
                .build();

        reviewRepository.save(review);
        return ResponseEntity.ok("Надіслано на модерацію");
    }

    @Data
    public static class ReviewRequest {
        private Long productId;
        private String text;
        private int rating;
        private String type;
    }

    // --- АДМІНСЬКІ МЕТОДИ ---
    @GetMapping("/admin/reviews/pending")
    public List<Review> getPendingReviews() {
        return reviewRepository.findByStatus("PENDING");
    }

    @PutMapping("/admin/reviews/{id}/status")
    public ResponseEntity<?> updateReviewStatus(@PathVariable Long id, @RequestParam String status) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setStatus(status);
        reviewRepository.save(review);
        return ResponseEntity.ok("Статус оновлено");
    }

    @PutMapping("/admin/reviews/{id}/reply")
    public ResponseEntity<?> replyToReview(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        String replyText = body.get("reply");
        review.setAdminReply(replyText);

        reviewRepository.save(review);
        return ResponseEntity.ok("Відповідь збережено!");
    }
}