package com.coursework.pc_configurator.controller;

import com.coursework.pc_configurator.model.Product;
import com.coursework.pc_configurator.repository.ProductRepository;
import com.coursework.pc_configurator.service.ConfiguratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.coursework.pc_configurator.dto.ProductRequest;
import com.coursework.pc_configurator.model.Category;
import com.coursework.pc_configurator.repository.CategoryRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ConfiguratorController {

    private final ProductRepository productRepository;
    private final ConfiguratorService configuratorService;
    private final CategoryRepository categoryRepository;

    // Перевірити сумісність
    @GetMapping("/check")
    public Map<String, Object> checkCompatibility(@RequestParam Long cpuId,
                                                  @RequestParam Long motherboardId) {
        return configuratorService.checkCompatibility(cpuId, motherboardId);
    }
}