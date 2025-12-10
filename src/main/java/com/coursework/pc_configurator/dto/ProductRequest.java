package com.coursework.pc_configurator.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private Double price;
    private String description;
    private String imageUrl;
    private String specifications;
    private Long categoryId;
}