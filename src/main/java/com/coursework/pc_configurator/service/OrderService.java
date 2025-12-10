package com.coursework.pc_configurator.service;

import com.coursework.pc_configurator.dto.OrderItemRequest;
import com.coursework.pc_configurator.dto.OrderRequest;
import com.coursework.pc_configurator.model.Order;
import com.coursework.pc_configurator.model.OrderItem;
import com.coursework.pc_configurator.model.Product;
import com.coursework.pc_configurator.model.User;
import com.coursework.pc_configurator.repository.OrderRepository;
import com.coursework.pc_configurator.repository.ProductRepository;
import com.coursework.pc_configurator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest request, String userEmail) {
        // 1. Знаходження користувача
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        // 2. Створення заготовки замовлення
        Order order = Order.builder()
                .user(user)
                .status("NEW")
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .totalPrice(0.0)

                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .deliveryAddress(request.getDeliveryAddress())
                .paymentMethod(request.getPaymentMethod())
                // -----------------------------
                .build();

        double totalAmount = 0;

        // 3. Проходження по товарах з кошика
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Товар не знайдено: " + itemRequest.getProductId()));

            // Створення рядка замовлення
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalPrice(totalAmount);

        // 4. Збереження
        return orderRepository.save(order);
    }

    // Метод для перегляду історії замовлень
    public List<Order> getUserOrders(String userEmail) {
        return orderRepository.findByUserEmail(userEmail);
    }

    // Методи для Адмін
    // Отримати ВСІ замовлення (відсортовані: нові зверху)
    public List<Order> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
    }

    // Змінити статус
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Замовлення не знайдено"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}