package com.coursework.pc_configurator.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;

    private String fullName;
    private String phoneNumber;
    private String deliveryAddress;
    private String paymentMethod;
}