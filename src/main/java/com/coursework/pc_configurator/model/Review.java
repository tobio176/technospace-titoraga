package com.coursework.pc_configurator.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String text;

    private int rating;

    // "REVIEW" або "QUESTION"
    private String type;

    // "PENDING", "APPROVED", "REJECTED"
    private String status;

    private LocalDateTime createdAt;

    // Відповідь адміна
    @Column(columnDefinition = "TEXT")
    private String adminReply;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties("reviews")
    private Product product;
}