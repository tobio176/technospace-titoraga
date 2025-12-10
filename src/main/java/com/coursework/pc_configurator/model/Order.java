package com.coursework.pc_configurator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shop_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private Double totalPrice;
    private LocalDateTime createdAt;
    private String status; // NEW, IN_PROGRESS, COMPLETED, CANCELLED

    private String fullName;       // ПІБ
    private String phoneNumber;    // Телефон
    private String deliveryAddress;// Номер відділення / Адреса
    private String paymentMethod;  // CASH або CARD (при отриманні)
}